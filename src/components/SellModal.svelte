<script>
    import {ProductService} from "../services/product.service";
    import {HistoryService} from "../services/history.service";
    import { onMount } from 'svelte';
    import WarningModal from './WarningModal.svelte';

    export let show = false, _id, productName = '', productType = '', amount = null, quantity = null,
    submited = false, originalPrice = null, sellingPrice = null;

    let showWarningModal = false, warningModalMessage = '';
    const date = new Date();
    let sellDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const productService = ProductService.getInstance();
    const historyService = HistoryService.getInstance();

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
        _id = null;
        productName = null;
        amount = null;
        show = false;
    }

    async function onSubmit() {
        if(!amount) return;
        quantity -= amount;
        let updatedProduct = {
            _id: _id,
            quantity,
        }
        let res = await productService.changeProduct(updatedProduct);
        if (res.status === 200) {
          // TODO! აქ დასამატებელი იქნება ისტორიის დამატებისას ხომ არ მოხდა შეცდომა
          addSellHistory();
          show=false;
          submited = true;
          _id = res._id;
        } else {
          warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტისთვის რაოდენობის დაკლების დროს!'
          showWarningModal = true;
          return;
        }
        
    }

    function addSellHistory() {
      let history = {
        productId: _id,
        productName,
        productType,
        amount,
        originalPrice,
        sellingPrice,
        sellDate
      }
      historyService.addHistory(history);
      amount = null;
    }

    $: {
        if (amount < 0) {
            amount = 0;
        } else if (quantity && quantity - amount <= 0) {
            amount = quantity;
        }
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
        <h5 class="modal-title">პროდუქტ {productName}(ი)ს გაყიდვა</h5>
        <hr>
        <div class="form-group">
            <div>რაოდენობა:&emsp;</div>
            <input type="number" class="form-control" id="amount" bind:value={amount} placeholder={amount}>
        </div>
        <div class="form-group">
            <div>ფასი:&emsp;</div>
            <input type="number" class="form-control" id="amount" bind:value={sellingPrice} placeholder={amount}>
        </div>
        <div class="form-group">
            <div>თარიღი:&emsp;</div>
            <input type="date" class="form-control" id="amount" bind:value={sellDate} placeholder={amount}>
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