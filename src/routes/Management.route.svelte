<script>
    import {ManagementService} from "../services/management.service";
    import { onMount } from 'svelte';
    import { ObjectHelper } from "../utils/ObjectHelper";
    import AddPasswordModal from '../components/management/EditPasswordModal.svelte'
    
    const managementService = ManagementService.getInstance();
    let managementExists = false, managementFound = false; 

    let showPasswordEditModal = false, passwordEditType = 'EDIT';

    onMount(async () => {
        const management = await managementService.findManagement();
        managementFound = true;
        
        if (ObjectHelper.isNotNullOrUndefined(management.management)) {
            managementExists = true;
        }
    });

    function passwordAdded() {
        managementExists = true;
    }

</script>

<style>

    #content {
        width: 100%;
        text-align: center;
        height: 50%;
    }

    .button-content {
        margin: 100px;
    }

</style>

{#if managementFound}
<div id="content">  
    <div class="button-content">  
        {#if !managementExists}
            <!-- svelte-ignore a11y-missing-attribute -->
            <button type="button" class="btn btn-primary" on:click={() => {
                passwordEditType = 'ADD'; 
                showPasswordEditModal = true;
            }}>პაროლის დამატება</button>
        {:else}
            <!-- svelte-ignore a11y-missing-attribute -->
            <button type="button" class="btn btn-primary" on:click={() => { 
                passwordEditType = 'EDIT';
                showPasswordEditModal = true;
            }}>პაროლის შეცვლა</button>
        {/if}
    </div>   
</div>
{/if}

<AddPasswordModal
bind:show={showPasswordEditModal}
bind:editType={passwordEditType}
on:passwordAdded={passwordAdded}
/>