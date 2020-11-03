<script>
    import {ProductService} from "../services/product.service";
    import {HistoryService} from "../services/history.service";
    import { onMount } from 'svelte';
    import WarningModal from './WarningModal.svelte';

    const QuanitityType = {
      COUNT: "რაოდენობითი",
      WEIGHT: "წონითი"
    }

    export let show = false, _id, productCode = '', productName = '', productType = '', amount = null, quantity = null,
    quantityType = QuantityType.COUNT, submited = false, originalPrice = null, sellingPrice = null;

    let amountChanged = false, fullPriceChanged = false, sellingPriceChanged = false;
    let fullPrice = null;
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
        show = false;
    }

    async function onSubmit() {
        if(!amount) return;
        let updatedProduct = {
            _id: _id,
            quantity: quantity - amount,
        }
        let res = await productService.changeProduct(updatedProduct);
        if (res.status === 200) {
          // TODO! აქ დასამატებელი იქნება ისტორიის დამატებისას ხომ არ მოხდა შეცდომა
          addSellHistory();
          show=false;
          submited = true;
          _id = res._id;
          quantity -= amount;
          amount = null;
        } else {
          warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტისთვის რაოდენობის დაკლების დროს!'
          showWarningModal = true;
          return;
        }
    }

    function addSellHistory() {
      let history = {
        productCode,
        productId: _id,
        productName,
        productType,
        amount,
        originalPrice,
        sellingPrice,
        sellDate
      }
      historyService.addHistory(history);
    }

    $: {
      
      if (amountChanged) {
        console.log("asd");
        // if the amount is less than 0 or more than the available quantity, fix it
        if (amount < 0) {
          amount = 0;
        } else if ((quantity || quantity == 0) && quantity - amount <= 0) {
          amount = quantity;
        }

        // if the amount is not the integer and the product's quantity type is COUNT, floor the amount
        if (isCountType() && !isInt(amount)) {
          amount = Math.floor(amount);
        }
        
        // if the amount's decimal points are more than 3, fix it to 3
        if (!isCountType() && getDecimalPoints(amount) > 3) {
          amount = amount.toFixed(3);
        }
        fullPrice = getFullPrice();
        amountChanged = false;
        console.log(fullPrice, amount);
      }

      if (fullPriceChanged) {
        console.log("dsa");
        amount = getAmount();
        fullPriceChanged = false;
      }

      if (sellingPriceChanged) {
        fullPrice = getFullPrice();
        sellingPriceChanged = false;
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