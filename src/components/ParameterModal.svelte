<script>
    import { ParameterService } from "../services/parameter.service";
    import { onMount } from 'svelte';
    import WarningModal from './WarningModal.svelte'
  
    const ParameterType = {
        INTEGER: "რიცხვი",
        STRING: "ტექსტი",
        LIST: "სია"
    }
  
    export let show, title = 'დამატება', submited = false, isChange;
    export let _id, name = null, description = null, parameterType = ParameterType.INTEGER, value = null;
  
    let showWarningModal = false, warningModalMessage = '';
    
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
    
    const parameterService = ParameterService.getInstance();
  
    async function onSubmit() {
        let updatedParameter = {
            _id,
            name,
            description,
            parameterType,
            value
        }

        if (name && parameterType) {
            let res = null;
            if (!isChange) res = await parameterService.addParameter(updatedParameter);
            else res = await parameterService.changeParameter(updatedParameter);

            if (res.status === 200) {
                show = false;
                submited = true;
                _id = res._id;
            } else {
                warningModalMessage = 'დაფიქსირდა შეცდომა პარამეტრის ' + (isChange ? 'რედაქტირების' : 'დამატების') + ' დროს!';
                showWarningModal = true;
            }
        }
    }
  
    function onClose() {
        _id = null;
        name = null;
        description = null;
        parameterType = ParameterType.INTEGER;
        value = null;
        show = false;
    }
    
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
  
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
            <h5 class="modal-title">პარამეტრის {title}</h5>
            <hr>
            <div class="form-group">
                <div>სახელი:&emsp;</div>
                <input type="text" class="form-control" bind:value={name}>
            </div>
            <div class="form-group">
                <div>აღწერა:&emsp;</div>
                <input type="text" class="form-control" bind:value={description}>
            </div>
            <div class="form-group">
                <div>ტიპი:&emsp;</div>
                <select class="form-control" bind:value={parameterType}>
                    {#each Object.values(ParameterType) as parameterType}
                        <option>{parameterType}</option>
                    {/each}
                </select>
            </div>
            <div class="form-group">
                <div>მნიშვნელობა:&emsp;</div>
                <input type="text" class="form-control" bind:value={value}>
            </div>
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