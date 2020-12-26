<script>
    import { onMount } from "svelte";

    export let show;
    export let products;
    export let reverseProducts;
    export let code;
    export let added;
    let name;
    let names = [];
    let codes = [];
    let showCodeSuggestion = false;
    let showNameSuggestion = false;

    function onClose() {
        code = undefined;
        name = undefined;
        show = !show;
    }

    function onSubmit() {
        added = true;
        show = !show;
    }

    onMount(() => {
        codes = Array.from(products.keys());
        names = Array.from(products.values());
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
            <input type="number" class="form-control" bind:value={code} on:keyup={() => {
                showCodeSuggestion = true;
            }}>
        </div>
        {#if showCodeSuggestion}
            {#each codes.filter((elem)=>{
                return ("" + elem).includes("" + code);
            }) as c}
                <div on:click={() => {
                    code = c; 
                    name = products.get(c);
                    showCodeSuggestion = false;
                }}>
                    {c}
                </div>
            {/each}
        {/if}
        <div class="form-group">
            <div class="label">სახელი:</div>
            <input type="text" class="form-control" bind:value={name} on:keyup={() => {
                showNameSuggestion = true;
            }}>
        </div>
        {#if showNameSuggestion}
            {#each names.filter((elem)=> {
                return elem.includes(name);
            }) as n}
                <div on:click={() => {
                    name = n;
                    code = reverseProducts.get(n);
                    showNameSuggestion = false;   
                }}>
                    {n}
                </div>
            {/each}
        {/if}
        <div>
            <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
            <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
        </div>
    </div>
</div>