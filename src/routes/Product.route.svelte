<script>
    let columnNames = ['იდენტ.', 'სახელი', 'ტიპი', 'რაოდენობა', 'გაყიდვის ფასი', 'ყიდვის ფასი'];
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
    }
</style>

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col">{column}</th>
        {/each}
        <th class="actionsTh" scope="col"></th>
    </tr>
    </thead>
    <tbody>
    <tr id="adminTr">
        {#each columnNames as column}
            <td></td>
        {/each}
        <td>
            <div class="actionButtonsDiv">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image"
                       src="images/edit.jpg"
                       class="actionButtons" 
                       width="27px" height="27px">
                <!-- svelte-ignore a11y-missing-attribute -->
                <input type="image"
                       src="images/delete.png"
                       class="actionButtons" 
                       width="27px" height="27px">
            </div>
        </td>
    </tr>
    </tbody>
</table>