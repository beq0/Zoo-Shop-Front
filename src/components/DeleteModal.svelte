<script>
    import { onMount } from 'svelte';

    export let show = false, toDeleteId, service, submited;

    onMount(() => {
        addEventListener("keyup", (event) => {
            if (show && event.key === 'Enter') {
                onSubmit();
            }
            if (show && event.key === 'Escape') {
                onClose();
            }
        });
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
        }
    }

</script>
  
<style>
    .popup .overlay {
        position:fixed;
        top:0px;
        left:0px;
        width:100vw;
        height:100vh;
        background:rgba(0,0,0,0.7);
        z-index:1;
        display:none;
    }
  
    .content {
        padding: 12px 25px !important;
    }
  
    .popup .content {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%) scale(0);
        background:#fff;
        z-index:2;
        text-align:center;
        padding:20px;
        box-sizing:border-box;
        font-family:"Open Sans",sans-serif;
    }
  
    .popup.active .overlay {
        display:block;
    }
  
    .popup.active .content {
        transition:all 300ms ease-in-out;
        transform:translate(-50%,-50%) scale(1);
    }
  
    .closeButton {
        background: #f15454 !important;
        border-color: #f15454 !important;
    }
  
    .confirmButton {
        background: #17d417 !important;
        border-color: #17d417 !important;
    }
  
    .modal-title {
        font-weight: bold;
    }
  
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