<script>
    import { onMount } from "svelte";
    import { ProductService } from "../services/product.service";
    import ChooseProductModal from "../components/ChooseProductModal.svelte";
    import WarningModal from "../components/WarningModal.svelte";
    import ConfirmModal from '../components/ConfirmModal.svelte';
    import {NumberHelper} from "../utils/NumberHelper";

    export let data;
    const columnNames = ["კოდი", "სახელი", "საცალო ფასი", "რაოდენობა", "ტიპი", "ჯამური ფასი", "შენიშვნა"];
    const productService = ProductService.getInstance();
    let quantityOrPriceChangeEvent;
    let totalPriceChangeEvent;
    let products;
    let showButtons = false;
    let productsMap = new Map();
    let items = new Map();
    let pricesByKey = new Map();
    let totalPricesByKey = new Map();
    let descriptionsByKey = new Map();
    let namesByKey = new Map();
    let keysByName = new Map();
    let keys = new Set();
    let showAddModal = false;
    let chosenCode;
    let manuallyAdded = false;
    let sum = 0;
    let showWarningModal = false;
    let warningModalMessage = "";
    let arrKeys = [];
    let isInCash = true;
    let fullAmount = null, fullAmountChanged = false, change = null;
    let showSellConfirmation = false, sellConfirmed = false;
    let sellConfirmationMessage = "";

    $: if(data.add) {
        setTimeout(() => {
            if(!products) return;
            if(!productsMap[data.keysPressed]) {
                //maybe add more later
                return;
            }
            if(items[data.keysPressed]) {
                items[data.keysPressed]++;
            }
            else {
                items[data.keysPressed] = 1;
                keys.add(data.keysPressed);
                arrKeys = Array.from(keys);
                showButtons = keys.size;
            }
            data.keysPressed = "";
            dispatchEvent(quantityOrPriceChangeEvent); 
        }, 40);
        data.add = false;
    }

    $: if(manuallyAdded) {
        if(items[chosenCode]) {
            items[chosenCode]++;
        }
        else {
            items[chosenCode] = 1;
            keys.add(chosenCode);
            arrKeys = Array.from(keys);
            showButtons = keys.size;
        }
        dispatchEvent(quantityOrPriceChangeEvent); 
        manuallyAdded = false;
        chosenCode = undefined;
    }

    $: if (fullAmountChanged) {
        if (getDecimalPoints(fullAmount) > 2) fullAmount = fullAmount.toFixed(2);
        if (NumberHelper.isNonZero(fullAmount)) {
            let fullPrice = 0;
            keys.forEach(k => {
                fullPrice += items[k] * pricesByKey[k];
            });
            change = (fullAmount - fullPrice).toFixed(2);
        }
        fullAmountChanged = false;
    }

    $: if (sellConfirmed) {
        sell();
    }

    onMount(async () => {
        products = await productService.getProducts();
        products.forEach(product => {
            productsMap[product.code] = product;
            pricesByKey[product.code] = product.sellingPrice;
            namesByKey.set(product.code, product.name);
            keysByName.set(product.name, product.code);
        });
        quantityOrPriceChangeEvent = new Event('quantityorprice')
        totalPriceChangeEvent = new Event("totalprice");
        addEventListener('quantityorprice', () => {
            sum = 0;
            keys.forEach((key) => {
                let max = getWholeQuantity(productsMap[key]);
                if(items[key] > max) 
                    items[key] = max;
                totalPricesByKey[key] = items[key] * pricesByKey[key];
                sum += totalPricesByKey[key];
            });
        });
        addEventListener('totalprice', () => {
            sum = 0;
            keys.forEach((key) => {
                items[key] = totalPricesByKey[key] / pricesByKey[key];
                sum += totalPricesByKey[key];
            });
        });
    }); 

    function onDelete(key) {
        items[key] = 0;
        sum -= totalPricesByKey[key];
        pricesByKey[key] = productsMap[key].sellingPrice;
        descriptionsByKey.delete(key);
        keys.delete(key);
        arrKeys = Array.from(keys);
        showButtons = keys.size;
    }

    function onFocus(event) {
        event.path[0].select();
        setTimeout(()=>{
            event.path[0].blur();
        }, 10000);
    }

    function onDiscard() {
        keys.forEach((key) => {
            onDelete(key);
        });
    }

    function addManually() {
        showAddModal = true;
    }

    function getWholeQuantity(prod) {
        return prod.quantity.reduce((sum1, qt) => { return sum1 + qt.quantity}, 0);
    }

    async function onSell() {
        sellConfirmationMessage = "დარწმუნებული ხართ, რომ გსურთ პროდუქტების გაყიდვა?";
        showSellConfirmation = true;
    }

    async function sell() {
        keys.forEach(async (key) => {
            let res = await productService.sellProduct(productsMap[key]._id, items[key], pricesByKey[key], null, descriptionsByKey[key], isInCash);
            if (res.status === 200) {
                productsMap[key].quantity = res.newQuantity;
                sum = 0;
                fullAmount = 0;
                change = 0;
                fullAmountChanged = true;
            } else {
                warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტის გაყიდვიდსას!'
                showWarningModal = true;
                return;
            }
            onDiscard();
        });
        sum = 0;
        sellConfirmed = false;
        showSellConfirmation = false;
    }

    function getDecimalPoints(n) {
        if (n == null) return 0;
        let stringNumber = n.toString();
        if (!stringNumber.includes('.')) return 0;
        return stringNumber.length - (stringNumber.indexOf('.') + 1);
    }

    function throwTotalPriceChangeEvent() {
        dispatchEvent(totalPriceChangeEvent);     
    }

    function throwQuantityOrPriceChangeEvent() {
        dispatchEvent(quantityOrPriceChangeEvent);
    }
</script>

<style>
    .leftTooltipIconDiv {
        width: 27px;
        font-weight: normal;
    }

    .financial-input-div {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .financial-input-div > div {
        font-size: 22px;
        font-weight: bold;
        font-style: italic;
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
        border-top: 0px;
        text-align: end;
    }

    .confirm-buttons {
        text-align: center;
    }

    #isInCash {
        width: 16px;
        height: 16px;
        box-shadow: none;
    }

</style>

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 14%;">{column}</th>
        {/each}
        <th class="actionsTh" scope="col">
            <div class="leftTooltipIconDiv" style="margin-left: auto;" title="დამატება">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image" src="images/add.jpg" width="27px" height="27px" on:click={addManually}>
            </div>
        </th>
    </tr>
    </thead>
    <tbody>
        {#each arrKeys as key, i}
        <tr>
            <td>{key}</td>
            <td>{productsMap[key].name}</td>
            <td>
                <div class="financial-input-div">
                    <input type="number" class="form-control" bind:value={pricesByKey[key]} on:focus={onFocus} on:keyup={throwQuantityOrPriceChangeEvent} on:click={throwQuantityOrPriceChangeEvent}>
                   <div>&nbsp;₾</div>
                </div>
            </td>
            <td>
                <input type="number" class="form-control" bind:value={items[key]} on:focus={onFocus} on:keyup={throwQuantityOrPriceChangeEvent} on:click={throwQuantityOrPriceChangeEvent}>
            </td>
            <td>{productsMap[key].quantityType}</td>
            <td>
                <div class="financial-input-div">
                    <input type="number" class="form-control" bind:value={totalPricesByKey[key]} on:focus={onFocus} on:keyup={throwTotalPriceChangeEvent} on:click={throwTotalPriceChangeEvent}>
                    <div>&nbsp;₾</div>
                </div>
            </td>
            <td>
                <div class="financial-input-div">
                    <input type="text" class="form-control" bind:value={descriptionsByKey[key]} on:focus={onFocus}>
                </div>
            </td>
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <div class="leftTooltipIconDiv" title="წაშლა" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/delete.png" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onDelete(key);
                            }}>
                    </div>
                </div>
            </td>
        </tr>
        {/each}
        <tr class="sum-tr">
            <td class="sum-empty-td sum-td">ჯამი:</td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td" style="padding-left: 0; padding-right: 0;">
                <div class="td-input">
                    <div style="margin-right: 10px; font-size: 13px; text-align: center;">მთლიანი თანხა:</div>
                    <input type="number" class="form-control" bind:value={fullAmount}  on:input={() => {fullAmountChanged = true}}>
                </div>
            </td>
            <td class="sum-empty-td sum-td">
                <div class="td-input">
                    <div style="margin-right: 10px; font-size: 13px;">ნაშთი:</div>
                    <input type="number" class="form-control" bind:value={change} readonly>
                </div>
            </td>
            <td class="financial-td sum-td">{sum} ₾</td>
            <td class="sum-empty-td sum-td">
                <div class="td-input">
                    <div>ნაღდი:&emsp;</div>
                    <input type="checkbox" id="isInCash" bind:checked={isInCash}>
                </div>
            </td>
            <td class="sum-empty-td sum-td"></td>
        </tr>
    </tbody>
</table>

{#if showButtons}
    <div class="confirm-buttons">
        <button class="btn btn-primary confirmButton" style="margin-right: 20px;" on:click={onSell}>გაყიდვა</button>
        <button class="btn btn-primary closeButton" on:click={onDiscard}>გაუქმება</button>
    </div>
{/if}

{#if showAddModal}
    <ChooseProductModal 
        bind:show={showAddModal} 
        bind:products={namesByKey} 
        bind:reverseProducts={keysByName} 
        bind:code={chosenCode}
        bind:added={manuallyAdded}
    ></ChooseProductModal>
{/if}

{#if showWarningModal}
    <WarningModal
        bind:show={showWarningModal}
        bind:message={warningModalMessage}
    ></WarningModal>
{/if}

{#if showSellConfirmation}
    <ConfirmModal
        bind:show={showSellConfirmation}
        bind:confirmed={sellConfirmed}
        bind:message={sellConfirmationMessage}
    />
{/if}