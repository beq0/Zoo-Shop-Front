<script>
    import { onMount } from 'svelte';
    import WarningModal from '../components/WarningModal.svelte'

    export let show = false, service;

    let file;

    let showWarningModal = false, warningModalMessage = '';

    onMount(() => {
        addEventListener("keyup", (event) => {
            if (show && event.key === 'Escape') {
                onClose();
            }
        });
    });
    
    async function onSubmit() {
        let res = await service.addProductsFromFile(file);
        if (res.status === 200) {
            submited = true;
            onClose();
        } else {
            warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტების ჩამატების დროს'
            showWarningModal = true;
        }
    }

    function onClose() {
        show = false;
    }

    function onChange(event) {
        file = event.srcElement.files[0];
    }

</script>
  
<style>
    .closeButton {
        background: #3cb5cf !important;
        border-color: #3cb5cf !important;
    }
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">აირჩიეთ ფაილი</h5>
        <hr>
        <input type="file" style="border-style: dotted;" on:change={onChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
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