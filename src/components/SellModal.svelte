<script>
    import {ProductService} from "../services/product.service";
    import { onMount } from 'svelte';
    import WarningModal from './WarningModal.svelte';

    const QuanitityType = {
      COUNT: "ცალობითი",
      WEIGHT: "წონითი"
    }

    export let show = false, _id, productName = '', amount = null, quantity = null,
    quantityType = QuantityType.COUNT, submited = false, originalPrice = null, sellingPrice = null, availableAmount = null;

    let amountChanged = false, fullPriceChanged = false, sellingPriceChanged = false;
    let fullPrice = null;
    let showWarningModal = false, warningModalMessage = '';
    const date = new Date();
    let sellDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let description = null, isInCash = true;

    const productService = ProductService.getInstance();

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

    function isCountType() {
      return quantityType == QuanitityType.COUNT;
    }

    function isInt(n) {
      return n % 1 === 0;
    }

    function getDecimalPoints(n) {
      if (n == null) return 0;
      let stringNumber = n.toString();
      if (!stringNumber.includes('.')) return 0;
      return stringNumber.length - (stringNumber.indexOf('.') + 1);
    }
    
    function onClose() {
        _id = null;
        productName = null;
        amount = null;
        fullPrice = null;
        availableAmount = null;
        description = null;
        isInCash = true;
        show = false;
    }

    async function onSubmit() {
        if(!amount) return;
        let res = await productService.sellProduct(_id, amount, sellingPrice, sellDate, description, isInCash);
        if (res.status === 200) {
          availableAmount = null;
          show=false;
          submited = true;
          _id = res._id;
          quantity = res.newQuantity;
          originalPrice = res.newOriginalPrice;
          amount = null;
          fullPrice = null;
          description = null;
          isInCash = true;
        } else {
          warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტისთვის რაოდენობის დაკლების დროს!'
          showWarningModal = true;
          return;
        }
    }

    $: {
      
      if (amountChanged) {
        fixAmount();
        fullPrice = getFullPrice();
        amountChanged = false;
      }

      if (fullPriceChanged) {
        if (fullPrice < 0) fullPrice = 0;
        amount = getAmount();
        fullPriceChanged = false;
        fixAmount();
        if ((availableAmount || availableAmount == 0) && availableAmount - amount <= 0) {
          fullPrice = getFullPrice();
        }
      }

      if (sellingPriceChanged) {
        fullPrice = getFullPrice();
        sellingPriceChanged = false;
      }
      
    }

    function fixAmount() {
      // if the amount is less than 0 or more than the available amount, fix it
      if (amount < 0) {
        amount = 0;
      } else if ((availableAmount || availableAmount == 0) && availableAmount - amount <= 0) {
        amount = availableAmount;
      }

      // if the amount is not the integer and the product's quantity type is COUNT, floor the amount
      if (isCountType() && !isInt(amount)) {
        amount = Math.floor(amount);
      }
      
      // if the amount's decimal points are more than 3, fix it to 3
      if (!isCountType() && getDecimalPoints(amount) > 3) {
        amount = amount.toFixed(3);
      }
    }

    function getFullPrice() {
      return (amount * sellingPrice).toFixed(2);
    }

    function getAmount() {
      let result = fullPrice / sellingPrice;
      if (isCountType()) result = Math.floor(result);
      else result = result.toFixed(3);
      return result;
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

    #isInCash {
    height: 17px;
    box-shadow: none;
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
          <input type="number" class="form-control" id="amount" bind:value={amount} on:input={() => {amountChanged = true}} placeholder={isCountType() ? 'ცალობითი რაოდენობა' : 'წონითი რაოდენობა'}>
        </div>

        <div class="form-group">
          <div>ჯამური ფასი:&emsp;</div>
          <input type="number" class="form-control" id="amount" bind:value={fullPrice} on:input={() => {fullPriceChanged = true}}>
        </div>

        <div class="form-group">
          <div>ფასი:&emsp;</div>
          <input type="number" class="form-control" id="amount" bind:value={sellingPrice} on:input={() => {sellingPriceChanged = true}}>
        </div>
        
        <div class="form-group">
          <div>თარიღი:&emsp;</div>
          <input type="date" class="form-control" id="amount" bind:value={sellDate}>
        </div>

        <div class="form-group">
          <div>ნაღდი:&emsp;</div>
          <input type="checkbox" class="form-control" id="isInCash" bind:checked={isInCash}>
        </div>

        <div class="form-group">
          <div>შენიშვნა:&emsp;</div>
          <input type="text" class="form-control" id="amount" bind:value={description}>
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