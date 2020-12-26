<script>
    import { onDestroy, onMount } from 'svelte';
    import WarningModal from './WarningModal.svelte'

    export let show = false, toDeleteId, service, submited;

    let showWarningModal = false, warningModalMessage = '';

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

    onDestroy(() => {
        
    });
    
    function onClose() {
        toDeleteId = null;
        show = false;
    }

    async function onSubmit() {
        let res = await service.delete(toDeleteId);
        if (res.status === 200) {
            submited = true;
            onClose();
        } else {
            warningModalMessage = 'დაფიქსირდა შეცდომა ობიექტის წაშლის დროს'
            showWarningModal = true;
        }
    }

</script>
  
<style> 
  
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">დარწმუნებული ხართ, რომ გსურთ ობიექტის წაშლა?</h5>
        <hr>
        <div>
            <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
            <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
        </div>
    </div>
</div>
{/if}

<WarningModal
bind:show={showWarningModal}
bind:message={warningModalMessage}
/>