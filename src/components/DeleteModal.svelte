<script>
    import { onDestroy, onMount } from 'svelte';
import { ObjectHelper } from '../utils/ObjectHelper';
    import WarningModal from './WarningModal.svelte'

    export let show = false, toDeleteId, service, submited;

    let password = null;
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
        password = null;
    }

    async function onSubmit() {
        if (ObjectHelper.isNullOrUndefined(password) || password.length < 8) {
            return;
        }
        let res = await service.delete(toDeleteId, password);
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
  
  .form-group {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .label {
        display: flex;
        align-items: center;
        margin-right: 15px;
    }

</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
        <h5 class="modal-title">დარწმუნებული ხართ, რომ გსურთ ობიექტის წაშლა?</h5>
        <hr>

        <div class="form-group">
            <div class="label">პაროლი:&nbsp;<span class="required-field" title="პაროლი უნდა იყოს&#013;მინიმუმ 8 სიგრძის">*</span></div>
            <input type="text" autocomplete="off" minlength="8" required class="form-control password-text-field" bind:value={password}>
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