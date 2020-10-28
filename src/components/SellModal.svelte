<script>
    import {ProductService} from "../services/product.service";
    import {HistoryService} from "../services/history.service";
    import { onMount } from 'svelte';

    export let show = false, _id, productName = '', productType = '', amount = null, quantity = null,
    submited = false, originalPrice = null, sellingPrice = null;

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
            show=false;
            submited = true;
            _id = res._id;
        }
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
    .popup .overlay {
      position:fixed;
      top:0px;
      left:0px;
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.7);
      z-index:1;
      display:none;
    }
  
    .content {
      padding: 12px 25px !important;
    }
  
    .popup .content {
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%) scale(0);
      background:#fff;
      z-index:2;
      text-align:center;
      padding:20px;
      box-sizing:border-box;
      font-family:"Open Sans",sans-serif;
    }
  
    .popup.active .overlay {
      display:block;
    }
  
    .popup.active .content {
      transition:all 300ms ease-in-out;
      transform:translate(-50%,-50%) scale(1);
    }
  
    .form-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  
    .form-control {
      width: 300px;
    }
  
    .closeButton {
      background: #f15454 !important;
      border-color: #f15454 !important;
    }
  
    .confirmButton {
      background: #17d417 !important;
      border-color: #17d417 !important;
    }
  
    .modal-title {
      font-weight: bold;
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