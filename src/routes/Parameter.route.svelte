<script>
    import { ParameterService } from "../services/parameter.service";
    import ParameterModal from "../components/ParameterModal.svelte"
    import DeleteModal from "../components/DeleteModal.svelte"
    import { onMount } from 'svelte';
    
    export let showToolbar;

    const ParameterType = {
        INTEGER: "რიცხვი",
        STRING: "ტექსტი",
        LIST: "სია"
    }
    
    let parameterService = ParameterService.getInstance();

    let columnNames = ['სახელი', 'აღწერა', 'ტიპი', 'მნიშვნელობა'];
    let filterName = '', filterDescription = '', filterType = '', filterValue = '';
    let showParameterModal = false, isChange = false, parameterModalSubmited = false;
    let _id, name = null, description = null, parameterType = ParameterType.INTEGER, value = null;
    let indexOfSelectedParameter;
    let toDeleteId = null, deleteModalShow = false, deleteModalSubmited = false, indexOfParameterToDelete = null;

    let parameters = [], allParameters = [];
    onMount(async () => {
        allParameters = await parameterService.findParameters();
        allParameters.reverse();
        parameters = allParameters;
    });

    function onChange(parameter, i) {
        _id = parameter._id
        name = parameter.name;
        description = parameter.description;
        parameterType = parameter.parameterType;
        value = parameter.value;
        showParameterModal = true;
        isChange = true;
        indexOfSelectedParameter = i;
    }
    
    function clearFilters() {
        filterName = '';
        filterDescription = '';
        filterType = '';
        filterValue = '';
    }

    function filterParameters() {
        parameters = allParameters.filter(param => param.name.toLowerCase().includes(filterName.toLowerCase())
                                            && param.description.toLowerCase().includes(filterDescription.toLowerCase())
                                            && param.parameterType.toLowerCase().includes(filterType.toLowerCase())
                                            && param.value.toLowerCase().includes(filterValue.toLowerCase()));
    }

    function onDelete(parameterId, index) {
        toDeleteId = parameterId;
        deleteModalShow = true;
        indexOfParameterToDelete = index;
    }

    $: {
        if (parameterModalSubmited) {
            parameterModalIsSubmited();
        }

        if (deleteModalSubmited) {
            deleteModalIsSubmited();
        }
    }

    function parameterModalIsSubmited() {
        let changedParameter = {
                _id,
                name,
                description,
                parameterType,
                value
            }
            if (!isChange) {
                parameters = [changedParameter, ...parameters];
                allParameters = [changedParameter, ...allParameters];
            } else {
                parameters[indexOfSelectedParameter]._id = changedParameter._id;
                parameters[indexOfSelectedParameter].name = changedParameter.name;
                parameters[indexOfSelectedParameter].description = changedParameter.description;
                parameters[indexOfSelectedParameter].parameterType = changedParameter.parameterType;
                parameters[indexOfSelectedParameter].value = changedParameter.value;
            }
            name = null;
            description = null;
            parameterType = ParameterType.INTEGER;
            value = null;
            parameterModalSubmited = false;
    }

    function deleteModalIsSubmited() {
        parameters = [...parameters.slice(0, indexOfParameterToDelete), ...parameters.slice(indexOfParameterToDelete + 1)];
        allParameters = allParameters.filter(param => param._id != toDeleteId);
        deleteModalSubmited = false;
    }

</script>

<style>
    td {
        border: 1px solid #fefefe;
    }

    th {
        text-align: center;
    }

    .actionButtonsDiv {
        display: flex;
        justify-content: flex-end;
    }

    .actionButtons {
        margin: 0 5px;
    }

    .actionsTh {
        width: 1%;
        padding: 2px;
        padding-right: 5px;
        text-align: end;
    }

    .toolbar {
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .toolbar-item {
        margin: 0 10px;
        font-style: italic;
    }

    .leftTooltipIconDiv {
        width: 27px;
        font-weight: normal;
    }
</style>

{#if showToolbar}
<div class="toolbar" id="toolbar">
    <div class="form-group toolbar-item toolbar">
        <span>სახელი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterName}>
    </div>

    <div class="form-group toolbar-item toolbar">
        <span>აღწერა:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterDescription}>
    </div>

    <div class="toolbar-item toolbar">
        <span>ტიპი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterType}>
    </div>

    <div class="toolbar-item toolbar">
        <span>მნიშვნელობა:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterValue}>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/search.png" width="27px" height="27px" style="margin: 0 8px;"
            on:click={filterParameters}>
    </div>
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px;"
            on:click={clearFilters}>
    </div>
</div>
{/if}

<table class="table">
    <!-- header -->
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 16%;">{column}</th>
        {/each}
        <th class="actionsTh" scope="col">
        <div class="leftTooltipIconDiv" style="margin-left: auto;">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image" src="images/add.jpg" width="27px" height="27px" on:click={()=>{
                    isChange = false;
                    showParameterModal = true;
                }}>
            </div>
        </th>
    </tr>
    </thead>

    <!-- values -->
    <tbody>
        {#each parameters as parameter, i}
        <tr>
            <td>{parameter.name}</td>
            <td>{parameter.description}</td>
            <td>{parameter.parameterType}</td>
            <td>{parameter.value}</td>
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <!-- change button -->
                    <div class="leftTooltipIconDiv" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/edit.jpg" class="actionButtons" width="27px" height="27px"
                            on:click={() => {
                                onChange(parameter, i);
                            }}>
                    </div>

                    <!-- delete button -->
                    <div class="leftTooltipIconDiv" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/delete.png" class="actionButtons" width="27px" height="27px"
                            on:click={async () => {
                                onDelete(parameter._id, i)
                            }}>
                    </div>
                </div>
            </td>
        </tr>
        {/each}
    </tbody>
</table>


<ParameterModal
bind:show={showParameterModal}
bind:isChange={isChange}
title={isChange ? 'რედაქტირება' : 'დამატება'}
bind:submited={parameterModalSubmited}
bind:_id={_id}
bind:name={name}
bind:description={description} 
bind:parameterType={parameterType} 
bind:value={value}
/>

<DeleteModal
bind:show={deleteModalShow}
bind:submited={deleteModalSubmited}
bind:toDeleteId={toDeleteId}
bind:service={parameterService}
/>