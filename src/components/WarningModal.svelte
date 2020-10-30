<script>
    import { onMount } from 'svelte';

    export let show = false, message;

    onMount(() => {
        addEventListener("keyup", (event) => {
            if (show && event.key === 'Enter') {
                onClose();
            }
            if (show && event.key === 'Escape') {
                onClose();
            }
        });
    });
    
    function onClose() {
        message = '';
        show = false;
    }

</script>
  
<style>

    .closeButton {
        background: #3cb5cf !important;
        border-color: #3cb5cf !important;
    }
    
    .content {
        color: red;
    }
  
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">{message}</h5>
        <hr>
        <div>
            <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
        </div>
    </div>
</div>
{/if}