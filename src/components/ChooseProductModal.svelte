<script>
    import { onMount } from "svelte";
    import { AutoCompleteHelper } from "../utils/AutoCompleteHelper";

    export let show;
    export let products;
    export let reverseProducts;
    export let code;
    export let added;
    let suggested = false;
    let name;
    let names = [];
    let codes = [];

    function onClose() {
        code = undefined;
        name = undefined;
        show = !show;
    }

    function onSubmit() {
        if(!products.has(code)) return;
        added = true;
        show = !show;
    }

    onMount(() => {
        codes = Array.from(products.keys());
        names = Array.from(products.values());

        setTimeout(() => {
            AutoCompleteHelper.autocomplete(document.getElementById("_code"), codes, (v) => {
                suggested = true;
                code = v;
                name = products.get(v);
            });
            AutoCompleteHelper.autocomplete(document.getElementById("_name"), names, (v) => {
                suggested = true;
                name = v;
                code = reverseProducts.get(v);
            });
        }, 700);

        window.addEventListener("keyup", (event) => {
            if (show && event.key === 'Enter') {
                if(!suggested) {
                    onSubmit();
                }
                suggested = false;
            }
            if (show && event.key === 'Escape') {
                onClose();
            }
        })
    });
</script>

<style>
    
    .form-group {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
  
    .form-control {
        width: 300px;
    }

    .label {
        margin-right: 15px;
    }
  
</style>

<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">აირჩიეთ პროდუქტი</h5>
        <hr>
        <div class="form-group">
            <div class="label">კოდი:</div>
            <div class="autocomplete">
                <input id="_code" type="text" autocomplete="off" class="form-control" bind:value={code}>
            </div>
        </div>
        <div class="form-group autocomplete">
            <div class="label">სახელი:</div>
            <div class="autocomplete">
                <input id="_name" type="text" autocomplete="off" class="form-control" bind:value={name}>
            </div>
        </div>
        <div>
            <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
            <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
        </div>
    </div>
</div>