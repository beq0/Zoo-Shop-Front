<script>
    import { onMount } from 'svelte';

    export let show = false, products = {};

    onMount(() => {
        addEventListener("keyup", (event) => {
            if (show && event.key === 'Escape') {
                onClose();
            }
        });
    });
    
    function onClose() {
        show = false;
    }

</script>
  
<style>
  
    .closeButton {
        background: #3cb5cf !important;
        border-color: #3cb5cf !important;
    }

    .amounts {
        max-height: 400px;
        overflow-y: auto;
        font-size: 17px;
    }
    
    .product-name {
        font-weight: bold;
    }

</style>
  
{#if show}
    <div class="popup active" id="popup-1">
        <div class="overlay" on:click={onClose}></div>
            <div class="content">  
                <h5 class="modal-title">დეტალური რაოდენობები:</h5>
                <div class="amounts">
                    {#each Object.keys(products) as productName, i}
                        <div><span class="product-name">{productName}:&nbsp;&nbsp;</span>{products[productName]}</div>
                    {/each}
                </div>
                <hr>
                <div>
                    <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
                </div>
        </div>
    </div>
{/if}