<script>
    import {DeviceDetectorService} from "../services/deviceDetector.service";
    import ProductModal from "../components/ProductModal.svelte"

    let columnNames = ['სახელი', 'ტიპი', 'რაოდენობა', 'გაყიდვის ფასი', 'ყიდვის ფასი'];
    let filterName=null, filterType=null, filterStartPrice=null, filterEndPrice=null;
    let showModal = false;
    export let showToolbar;

</script>

<style>
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
        <input type="text" class="form-control" value={filterName}>
    </div>

    <div class="toolbar-item toolbar">
        <span>ტიპი:&emsp;</span>
        <input type="text" class="form-control" value={filterType}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საწყისი&nbsp;ფასი:&emsp;</span>
        <input type="number" class="form-control" value={filterStartPrice}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საბოლოო&nbsp;ფასი:&emsp;</span>
        <input type="number" class="form-control" value={filterEndPrice}>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <input type="image" src="images/search.png" width="27px" height="27px" style="margin: 0 8px;">
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <input type="image" src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px;">
</div>
{/if}

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col">{column}</th>
        {/each}
        <th class="actionsTh" scope="col">
        <div class="leftTooltipIconDiv" data-tooltip="დამატება" data-tooltip-location="left" style="margin-left: auto;">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image" src="images/add.jpg" width="27px" height="27px" on:click={()=>{showModal=true}}>
            </div>
        </th>
    </tr>
    </thead>
    <tbody>
        <tr id="adminTr">
            {#each columnNames as column}
                <td></td>
            {/each}
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <div class="leftTooltipIconDiv" data-tooltip="რედაქტირება" data-tooltip-location="left" style="margin-right: 10px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image"
                            src="images/edit.jpg"
                            class="actionButtons" 
                            width="27px" height="27px">
                    </div>
                    <div class="leftTooltipIconDiv" data-tooltip="წაშლა" data-tooltip-location="left" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image"
                            src="images/delete.png"
                            class="actionButtons" 
                            width="27px" height="27px">
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>

<ProductModal bind:show={showModal}/>