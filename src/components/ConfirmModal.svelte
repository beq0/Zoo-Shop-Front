
<script>
    import { onMount } from 'svelte';

    export let show = false, confirmed = false, message = "";

    onMount(() => {
        window.addEventListener("keyup", (event) => {
            if (show && event.key === 'Enter') {
                onSubmit();
            }
            if (show && event.key === 'Escape') {
                onClose();
            }
        })
    });
    
    function onClose() {
        closeModal();
        confirmed = false;
    }

    function onSubmit() {
        closeModal();
        confirmed = true;
    }
    
    function closeModal() {
        show = false;
        message = "";
    }

</script>
  
<style> 

</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">{message}</h5>
        <hr>
        <div>
            <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
            <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
        </div>
    </div>
</div>
{/if}