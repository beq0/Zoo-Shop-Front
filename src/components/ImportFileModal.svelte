<script>
    import { onMount } from 'svelte';
    import WarningModal from '../components/WarningModal.svelte'
    import { ExcelGenerator } from "../utils/ExcelGenerator";

    export let show = false, service, productsAdded, submitted;

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
        if(!file) return;
        let res = await service.addProductsFromFile(file);
        file = null;
        productsAdded = res.products;
        if (res.status === 200) {
            submitted = true;
            onClose();
        } else {
            warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტების ჩამატების დროს'
            showWarningModal = true;
        }
    }

    function onClose() {
        show = false;
    }

    function downloadTemplate() {
        const columnNames = ["კოდი", "სახელი", "პროვ. კოდი", "პროვ. სახელი", "პროდუქტის ტიპი", "გასაყიდი ფასი", 
        "რაოდენობა", "ასაღები ფასი", "რაოდ. ტიპი (ცალობითი/წონითი)", "ოფიციალური (კი/არა)"];
        let content = [[]]; 
        ExcelGenerator.saveWithOneSheet("შაბლონი", "შაბლონი", "ზ", "შაბლონი", "შაბლონი", columnNames, content);
    }

    function onChange(event) {
        file = event.srcElement.files[0];
    }

</script>
  
<style>
    .template-btn {
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
        <input type="file" class="fileUploadInput" on:change={onChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
        <hr>
        <button class="btn btn-primary template-btn" on:click={downloadTemplate}>შაბლონი</button>
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