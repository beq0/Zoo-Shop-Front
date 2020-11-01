<script>
    import {DeviceDetectorService} from "../services/deviceDetector.service";
    import ProductModal from "../components/ProductModal.svelte"
    import SellModal from "../components/SellModal.svelte"
    import DeleteModal from "../components/DeleteModal.svelte"
    import {ProductService} from "../services/product.service";
    import { onMount } from 'svelte';
    
    export let showToolbar;

    const ProductType = {
        FOOD: "საკვები",
        TOY: "სათამაშო",
        MEDICINE: "წამალი",
        ANIMAL: "ცხოველი",
        OTHER: "სხვა"
    }

    const QuanitityType = {
        COUNT: "რაოდენობითი",
        WEIGHT: "წონითი"
    }
    
    let productService = ProductService.getInstance();

    let columnNames = ['კოდი', 'სახელი', 'ტიპი', 'გაყიდვის ფასი', 'ყიდვის ფასი', 'რაოდენობა', 'რაოდ. ტიპი'];
    let filterCode = '', filterName='', filterType='', filterStartPrice=null, filterEndPrice=null;
    let showProductModal = false, isChange = false, showSellModal = false;
    let _id, productCode = null, name = null, productType = ProductType.FOOD, sellingPrice = null, 
            originalPrice = null, quantity = null, quantityType = QuanitityType.COUNT;
    let productModalSubmited = false;
    let indexOfSelectedProduct;
    let amountToSell = null;
    let sellModalSubmited = false;
    let toDeleteId = null, deleteModalShow = false, deleteModalSubmited = false, indexOfProductToDelete = null;

    let products = [], allProducts = [];
    onMount(async () => {
        allProducts = await productService.getProducts();
        products = allProducts;
    });

    function onChange(product, i) {
        _id = product._id
        productCode = product.code;
        name = product.name;
        productType = product.productType;
        sellingPrice = product.sellingPrice;
        originalPrice = product.originalPrice;
        quantity = product.quantity;
        quantityType = product.quantityType;
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
                                            && (filterEndPrice == null || prod.sellingPrice <= filterEndPrice))
    }

    function onSell(product, i) {
        _id = product._id;
        name = product.name;
        quantity = product.quantity;
        quantityType = product.quantityType;
        sellingPrice = product.sellingPrice;
        originalPrice = product.originalPrice;
        indexOfSelectedProduct = i;
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
    }

    function productModalIsSubmited() {
        let changedProduct = {
                _id,
                code: productCode,
                name,
                productType: productType,
                sellingPrice,
                originalPrice,
                quantity,
                quantityType
            }
            if (!isChange) {
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
            }
            productCode = null;
            name = null;
            productType = ProductType.FOOD;
            sellingPrice = null;
            originalPrice = null;
            quantity = null;
            quantityType = QuanitityType.COUNT
            productModalSubmited = false;
    }

    function sellModalIsSubmited() {
        products[indexOfSelectedProduct].quantity = quantity;
        name = null;
        sellModalSubmited = false;
    }

    function deleteModalIsSubmited() {
        products = [...products.slice(0, indexOfProductToDelete), ...products.slice(indexOfProductToDelete + 1)];
        allProducts = allProducts.filter(prod => prod._id != toDeleteId);
        deleteModalSubmited = false;
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
</style>

{#if showToolbar}
<div class="toolbar" id="toolbar">
    <div class="form-group toolbar-item toolbar">
        <span>კოდი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterCode}>
    </div>
    
    <div class="form-group toolbar-item toolbar">
        <span>სახელი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterName}>
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

    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/search.png" width="27px" height="27px" style="margin: 0 8px;"
            on:click={filterProducts}>
    </div>
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px;"
            on:click={clearFilters}>
    </div>
</div>
{/if}

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 16%;">{column}</th>
        {/each}
        <th class="actionsTh" scope="col">
        <div class="leftTooltipIconDiv" style="margin-left: auto;">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image" src="images/add.jpg" width="27px" height="27px" on:click={()=>{
                    isChange = false;
                    showProductModal = true;
                }}>
            </div>
        </th>
    </tr>
    </thead>
    <tbody>
        {#each products as product, i}
        <tr>
            <td>{product.code}</td>
            <td>{product.name}</td>
            <td>{product.productType}</td>
            <td style="text-align: end;">{product.sellingPrice.toFixed(2)} ₾</td>
            <td style="text-align: end;">{product.originalPrice.toFixed(2)} ₾</td>
            <td>{(Number.isInteger(product.quantity) ? product.quantity : product.quantity.toFixed(product.quantityType == QuanitityType.WEIGHT ? 3 : 2)) +
                 (product.quantityType == QuanitityType.WEIGHT ? " კგ." : " ც.")}</td>
            <td>{product.quantityType}</td>
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <div class="leftTooltipIconDiv" data-tooltip="გაყიდვა" data-tooltip-location="left" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/sell.png" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onSell(product, i);
                            }}>
                    </div>
                    <div class="leftTooltipIconDiv" data-tooltip="რედაქტირება" data-tooltip-location="left" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/edit.jpg" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onChange(product, i);
                            }}>
                    </div>
                    <div class="leftTooltipIconDiv" data-tooltip="წაშლა" data-tooltip-location="left" style="margin-right: 5px;">
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

<ProductModal bind:show={showProductModal}
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
              bind:submited={productModalSubmited}
              />

<SellModal
bind:show={showSellModal}
bind:_id={_id}
bind:productName={name}
bind:productType={productType}
bind:amount={amountToSell}
bind:submited={sellModalSubmited}
bind:quantity={quantity}
sellingPrice={sellingPrice}
bind:originalPrice={originalPrice}
bind:quantityType={quantityType}
/>

<DeleteModal
bind:show={deleteModalShow}
bind:submited={deleteModalSubmited}
bind:toDeleteId={toDeleteId}
bind:service={productService}
/>