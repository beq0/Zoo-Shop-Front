<script>
    import { onMount } from 'svelte';
    import { ObjectHelper } from '../../utils/ObjectHelper';
    import WarningModal from '../WarningModal.svelte'
    import {ManagementService} from "../../services/management.service";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    const managementService = ManagementService.getInstance();

    export let show = false, editType = 'ADD';

    let showWarningModal = false, warningModalMessage = '';
    let password = null, oldPassword = null, newPassword = null;

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
        password = null;
        newPassword = null;
        oldPassword = null;
        show = false;
    }

    async function onSubmit() {
        let res = null;
        if (editType === 'ADD') {
            if (ObjectHelper.isNotNullOrUndefined(password) && password.length >= 8) {
                res = await managementService.addPassword(password);
                if (res.status === 200) {
                    onClose();
                    dispatch('passwordAdded', {});
                } else {
                    warningModalMessage = 'დაფიქსირდა შეცდომა პაროლის დამატების დროს';
                    showWarningModal = true;
                }
            }
        } else {
            if (ObjectHelper.isNotNullOrUndefined(oldPassword) && oldPassword.length >= 8 &&
            ObjectHelper.isNotNullOrUndefined(newPassword) && newPassword.length >= 8) {
                res = await managementService.changePassword(oldPassword, newPassword);
                if (res.status === 200) {
                    onClose();
                } else {
                    warningModalMessage = 'დაფიქსირდა შეცდომა პაროლის შეცვლის დროს';
                    showWarningModal = true;
                }
            }
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
        <h5 class="modal-title">პაროლის დამატება</h5>
        <hr>
        
        {#if editType === 'ADD'}
            <div class="form-group">
                <div class="label">პაროლი:&nbsp;<span class="required-field" title="პაროლი უნდა იყოს&#013;მინიმუმ 8 სიგრძის">*</span></div>
                <input type="text" autocomplete="off" minlength="8" required class="form-control password-text-field" bind:value={password}>
            </div>  
        {:else}
            <div class="form-group">
                <div class="label">ძველი&nbsp;პაროლი:&nbsp;<span class="required-field" title="პაროლი უნდა იყოს&#013;მინიმუმ 8 სიგრძის">*</span></div>
                <input type="text" autocomplete="off" minlength="8" required class="form-control password-text-field" bind:value={oldPassword}>
            </div>
            <div class="form-group">
                <div class="label">ახალი&nbsp;პაროლი:&nbsp;<span class="required-field" title="პაროლი უნდა იყოს&#013;მინიმუმ 8 სიგრძის">*</span></div>
                <input type="text" autocomplete="off" minlength="8" required class="form-control password-text-field" bind:value={newPassword}>
            </div>  
        {/if}

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