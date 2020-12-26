<script>
    import {DeviceDetectorService} from "../services/deviceDetector.service";
    import ProductModal from "../components/ProductModal.svelte";
    import SellModal from "../components/SellModal.svelte";
    import DeleteModal from "../components/DeleteModal.svelte";
    import ProductReport from "../components/reports/ProductReport.svelte"
    import {ProductService} from "../services/product.service";
    import { ParameterService } from "../services/parameter.service";
    import { onMount } from 'svelte';
    import { navigate } from "svelte-routing";
    import { ArrayHelper } from "../utils/ArrayHelper";
    import { NumberHelper } from "../utils/NumberHelper";
    import { AutoCompleteHelper } from "../utils/AutoCompleteHelper"

    export let show = {};

    const ParameterType = {
        INTEGER: "რიცხვი",
        STRING: "ტექსტი",
        LIST: "სია"
    }

    let ProductType = [
        "სხვა"
    ]

    let QuantityType = {
        COUNT: "ცალობითი",
        WEIGHT: "წონითი"
    }
    
    let productService = ProductService.getInstance(), parameterService = ParameterService.getInstance();
    
    let columnNames = ['კოდი', 'სახელი', 'ტიპი', 'ჯამ. გასა. ფასი', 'ჯამ. ასა. ფასი', 'გასა. ფასი', 'ასა. ფასი', 'რაოდენობა', 'რაოდ. ტიპი', 'განახ. თარიღი', 'შექმნ. თარიღი'];
    let toolbarShown = false, filterCode = '', filterName='', filterType='', filterStartPrice=null, filterEndPrice=null;
    let showProductModal = false, isChange = false, showSellModal = false;
    let _id, productCode = null, name = null, productType = ProductType[0], sellingPrice = null, 
            originalPrice = null, quantity = null, quantityType = QuantityType.COUNT, official = true;
    let productModalSubmited = false, quantitiesFromProductModal = [];
    let indexOfSelectedProduct;
    let amountToSell = null;
    let sellModalSubmited = false, availableAmount = null;
    let toDeleteId = null, deleteModalShow = false, deleteModalSubmited = false, indexOfProductToDelete = null;

    if(DeviceDetectorService.isBrowser) {
        let url = new URL(window.location.href);
        filterCode = url.searchParams.get('code') || '';
        filterName = url.searchParams.get('name') || '';
        filterType = url.searchParams.get('type') || '';
        filterStartPrice = parseInt(url.searchParams.get('start')) || null;
        filterEndPrice = parseInt(url.searchParams.get('end')) || null;
        show.showToolbar = filterCode || filterName || filterType || filterEndPrice || filterStartPrice;
    }

    let products = [], allProducts = [], allProductCodes = [], allProductNames = [];
    onMount(async () => {
        allProducts = await productService.getProducts();
        products = allProducts;
        allProductCodes = allProducts.map(prod => prod.code);
        allProductNames = allProducts.map(prod => prod.name);

        initializeParameters();
        if(show.showToolbar) {
            filterProducts();
        }
    });

    async function initializeParameters() {
        let res = await parameterService.getParameter("productTypes", ParameterType.LIST, ["სხვა"]);
        ProductType = ('' + res.value).split(",");
    }

    function onChange(product, i) {
        _id = product._id
        productCode = product.code;
        name = product.name;
        productType = product.productType;
        sellingPrice = product.sellingPrice;
        originalPrice = product.originalPrice;
        quantity = product.quantity;
        quantityType = product.quantityType;
        official = product.official;
        quantitiesFromProductModal = product.quantity;
        showProductModal = true;
        isChange = true;
        indexOfSelectedProduct = i;
    }
    
    function clearFilters() {
        filterCode = '';
        filterName='';
        filterType='';
        filterStartPrice=null;
        filterEndPrice=null;
    }

    function filterProducts() {
        products = allProducts.filter(prod => prod.code.toLowerCase().includes(filterCode.toLowerCase())
                                            && prod.name.toLowerCase().includes(filterName.toLowerCase())
                                            && prod.productType.toLowerCase().includes(filterType.toLowerCase()) 
                                            && (filterStartPrice == null || prod.sellingPrice >= filterStartPrice)
                                            && (filterEndPrice == null || prod.sellingPrice <= filterEndPrice));
        let url = new URL(window.location.href);
        url.searchParams.set('code', filterCode || '');
        url.searchParams.set('name', filterName || '');
        url.searchParams.set('type', filterType || '');
        url.searchParams.set('start', filterStartPrice || '');
        url.searchParams.set('end', filterEndPrice || '');
        navigate(url.toString());
    }

    function onSell(product, i) {
        _id = product._id;
        productCode = product.code;
        name = product.name;
        productType = product.productType;
        quantity = product.quantity;
        quantityType = product.quantityType;
        sellingPrice = product.sellingPrice;
        originalPrice = product.originalPrice;
        official = product.official;
        indexOfSelectedProduct = i;
        availableAmount = getWholeQuantity(product);
        showSellModal = true;
    }

    function onDelete(productId, index) {
        toDeleteId = productId;
        deleteModalShow = true;
        indexOfProductToDelete = index;
    }

    $: {
        if (productModalSubmited) {
            productModalIsSubmited();
        }

        if (sellModalSubmited) {
            sellModalIsSubmited();
        }

        if (deleteModalSubmited) {
            deleteModalIsSubmited();
        }

        if (show.showToolbar) {
            if (!toolbarShown) {
                setTimeout(() => {
                    AutoCompleteHelper.autocomplete(document.getElementById("product-code-filter"), allProductCodes, (v) => filterCode = v);
                    AutoCompleteHelper.autocomplete(document.getElementById("product-name-filter"), allProductNames, (v) => filterName = v);
                }, 150);
            }
            toolbarShown = show.showToolbar;
        } else {
            toolbarShown = false;
        }
    }

    function productModalIsSubmited() {
        let changedProduct = {
                _id,
                code: productCode,
                name,
                productType: productType,
                sellingPrice,
                originalPrice: ArrayHelper.isNotEmpty(quantitiesFromProductModal) ? quantitiesFromProductModal[0].originalPrice : 0,
                quantity: quantitiesFromProductModal,
                quantityType,
                official,
                lastChangeDate: new Date()
            }
            if (!isChange) {
                changedProduct['createDate'] = new Date();
                products = [changedProduct, ...products];
                allProducts = [changedProduct, ...allProducts];
            } else {
                products[indexOfSelectedProduct]._id = changedProduct._id;
                products[indexOfSelectedProduct].code = changedProduct.code;
                products[indexOfSelectedProduct].name = changedProduct.name;
                products[indexOfSelectedProduct].productType = changedProduct.productType;
                products[indexOfSelectedProduct].sellingPrice = changedProduct.sellingPrice;
                products[indexOfSelectedProduct].originalPrice = changedProduct.originalPrice;
                products[indexOfSelectedProduct].quantity = changedProduct.quantity;
                products[indexOfSelectedProduct].quantityType = changedProduct.quantityType;
                products[indexOfSelectedProduct].official = changedProduct.official;
                products[indexOfSelectedProduct].lastChangeDate = new Date();
            }
            productCode = null;
            name = null;
            productType = ProductType[0];
            sellingPrice = null;
            originalPrice = null;
            quantity = null;
            quantityType = QuantityType.COUNT
            productModalSubmited = false;
    }

    function sellModalIsSubmited() {
        products[indexOfSelectedProduct].quantity = quantity;
        products[indexOfSelectedProduct].originalPrice = originalPrice;
        name = null;
        sellModalSubmited = false;
    }

    function deleteModalIsSubmited() {
        products = [...products.slice(0, indexOfProductToDelete), ...products.slice(indexOfProductToDelete + 1)];
        allProducts = allProducts.filter(prod => prod._id != toDeleteId);
        deleteModalSubmited = false;
    }

    function getDateString(date) {
        date = new Date(date);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    function getWholeQuantity(prod) {
        return prod.quantity.reduce((sum1, qt) => { return sum1 + qt.quantity}, 0);
    }

</script>

<style>
    td {
        border: 1px solid #fefefe;
    }

    th {
        text-align: center;
    }

    .actionButtonsDiv {
        display: flex;
        justify-content: flex-end;
    }

    .actionButtons {
        margin: 0 5px;
    }

    .actionsTh {
        width: 1%;
        padding: 2px;
        padding-right: 5px;
        text-align: end;
    }

    .toolbar {
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .toolbar-item {
        margin: 0 10px;
        font-style: italic;
    }

    .leftTooltipIconDiv {
        width: 27px;
        font-weight: normal;
    }

    .sum-tr {
        background-color: lightsteelblue;
    }

    .sum-td {
        font-weight: bold;
    }

    .sum-empty-td {
        border: none;
    }

    .financial-td {
        text-align: end;
    }

</style>

{#if show.showToolbar}
<!-- svelte-ignore a11y-missing-attribute -->
<iframe name="decoy_iframe" style="display:none;"></iframe>
<form autocomplete="off" class="toolbar" id="toolbar" action="#" target="decoy_iframe" on:submit={filterProducts}>
    <div class="form-group toolbar-item toolbar autocomplete">
        <span>კოდი:&emsp;</span>
        <input id="product-code-filter" type="text" class="form-control" bind:value={filterCode}>
    </div>
    
    <div class="form-group toolbar-item toolbar  autocomplete">
        <span>სახელი:&emsp;</span>
        <input id="product-name-filter" type="text" class="form-control" bind:value={filterName}>
    </div>

    <div class="toolbar-item toolbar">
        <span>ტიპი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterType}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საწყისი&nbsp;ფასი:&emsp;</span>
        <input type="number" class="form-control" bind:value={filterStartPrice}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საბოლოო&nbsp;ფასი:&emsp;</span>
        <input type="number" class="form-control" bind:value={filterEndPrice}>
    </div>

    <input type="submit" style="height: 0px; width: 0px; border: none; padding: 0px;" hidefocus="true" />
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div title="ძებნა">
        <img src="images/search.png" width="27px" height="27px" style="margin: 0 8px; cursor: pointer;"
            on:click={filterProducts}>
    </div>
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div title="ფილტრის გასუფთავება">
        <img src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px; cursor: pointer;"
            on:click={clearFilters}>
    </div>
</form>
{/if}

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 16%;">{column}</th>
        {/each}
        <th class="actionsTh" scope="col">
            <div class="leftTooltipIconDiv" style="margin-left: auto;" title="დამატება">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image" src="images/add.jpg" width="27px" height="27px" on:click={()=>{
                    isChange = false;
                    quantitiesFromProductModal = [];
                    showProductModal = true;
                }}>
            </div>
        </th>
    </tr>
    </thead>
    <tbody>
        <tr class="sum-tr">
            <td class="sum-empty-td sum-td">ჯამური:</td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="financial-td sum-td">{products.reduce((sum, prod) => { return sum + (getWholeQuantity(prod) * prod.sellingPrice) }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{products.reduce((sum, prod) => { return sum + (ArrayHelper.isNotEmpty(prod.quantity) ? prod.quantity.reduce((sum1, qt) => { return sum1 + qt.quantity * qt.originalPrice}, 0) : 0) }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{products.reduce((sum, prod) => { return sum + prod.sellingPrice }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{products.reduce((sum, prod) => { return sum + (NumberHelper.isNonZero(prod.originalPrice) ? prod.originalPrice : 0)}, 0).toFixed(2)} ₾</td>
            <td class="sum-td">{
                products.reduce((sum, prod) => { return prod.quantityType == QuantityType.COUNT ? sum + getWholeQuantity(prod) : sum }, 0) + " ც; " +
                products.reduce((sum, prod) => { return prod.quantityType == QuantityType.COUNT ? sum : sum + getWholeQuantity(prod) }, 0).toFixed(3) + " კგ."
            }
            </td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
        </tr>
        {#each products as product, i}
        <tr>
            <td>{product.code}</td>
            <td>{product.name}</td>
            <td>{product.productType}</td>
            <td class="financial-td">{(getWholeQuantity(product) * product.sellingPrice).toFixed(2)} ₾</td>
            <td class="financial-td">{ArrayHelper.isNotEmpty(product.quantity) ? (getWholeQuantity(product) * product.originalPrice).toFixed(2) : 0} ₾</td>
            <td class="financial-td">{product.sellingPrice.toFixed(2)} ₾</td>
            <td class="financial-td">{NumberHelper.isNonZero(product.originalPrice) ? product.originalPrice.toFixed(2) : 0} ₾</td>
            <td>{((getWholeQuantity(product)).toFixed(product.quantityType == QuantityType.WEIGHT ? 3 : 0)) +
                 (product.quantityType == QuantityType.WEIGHT ? " კგ." : " ც.")}</td>
            <td>{product.quantityType}</td>
            <td>{getDateString(product.lastChangeDate)}</td>
            <td>{getDateString(product.createDate)}</td>
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <div class="leftTooltipIconDiv"  title="გაყიდვა" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/sell.png" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onSell(product, i);
                            }}>
                    </div>
                    <div class="leftTooltipIconDiv"  title="რედაქტირება" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/edit.jpg" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onChange(product, i);
                            }}>
                    </div>
                    <div class="leftTooltipIconDiv"  title="წაშლა" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/delete.png" class="actionButtons" width="27px" height="27px"
                            on:click={async () => {
                                onDelete(product._id, i)
                            }}>
                    </div>
                </div>
            </td>
        </tr>
        {/each}
    </tbody>
</table>

<ProductModal 
bind:editedQuantities={quantitiesFromProductModal}
bind:show={showProductModal}
bind:isChange={isChange}
title={isChange ? 'რედაქტირება' : 'დამატება'}
bind:_id={_id}
bind:productCode={productCode}
bind:name={name}
bind:productType={productType} 
bind:sellingPrice={sellingPrice} 
bind:originalPrice={originalPrice}
bind:quantity={quantity}
bind:quantityType={quantityType}
bind:official={official}
bind:submited={productModalSubmited}
/>

<SellModal
bind:show={showSellModal}
bind:_id={_id}
bind:productName={name}
bind:amount={amountToSell}
bind:submited={sellModalSubmited}
bind:quantity={quantity}
sellingPrice={sellingPrice}
bind:originalPrice={originalPrice}
bind:quantityType={quantityType}
bind:availableAmount={availableAmount}
/>

<DeleteModal
bind:show={deleteModalShow}
bind:submited={deleteModalSubmited}
bind:toDeleteId={toDeleteId}
bind:service={productService}
/>

<ProductReport
bind:show={show.showProductReport}
/>