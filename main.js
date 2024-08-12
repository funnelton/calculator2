let consts = {
    pricing: [150, 175, 200],
    glassProfit: 50,
    tax: 10.1,
    posFee: 2.6,
}

let inputVinNumber = document.querySelector('#inputVinNumber');    
let vinNumberDecoderResult = document.querySelector('#vinNumberDecoderResult');
let selectVehicelType = document.querySelector('#selectVehicelType')
let inputGlassPartNumber = document.querySelector('#inputGlassPartNumber');
let extraChargeCheckbox = document.querySelector('#extraChargeCheckbox');
let extraChargeInput = document.querySelector('#extraChargeInput');
let fuelChargeCheckbox = document.querySelector('#fuelChargeCheckbox');
let fuelChargeInput = document.querySelector('#fuelChargeInput');
let withoutInstallationCheckbox = document.querySelector('#withoutInstallationCheckbox');
let posFeeCheckbox = document.querySelector('#posFeeCheckbox');
let getEstimateButton = document.querySelector('#getEstimateButton');

let glassPrice = document.querySelector('#glassPrice');
let accessoriesPrice = document.querySelectorAll('.accessoryPrice');

let modalVehicleName = document.querySelector('#modalVehicleName');
let modalVinNumber = document.querySelector('#modalVinNumber');
let modalGlassType = document.querySelector('#modalGlassType');
let modalGlassAndAccessoryPrice = document.querySelector('#modalGlassAndAccessoryPrice');
let modalReplacementPrice = document.querySelector('#modalReplacementPrice');
let modalFuelChargePrice = document.querySelector('#modalFuelChargePrice');
let modalTotalPrice = document.querySelector('#modalTotalPrice');
let modalPricing = document.querySelector('#modalPricing');




function defineGlassType(arr) {
    for (let elem of arr) {
        if (elem.checked) {
            return elem.value;
        }
    }
}

function getReplacementPrice(pricingArr, index) {
    return Number(pricingArr[index]);
}


function getSubTotal(replacementPrice, glassAndAccessoriesPrice) {
    let result = 0;
    for (let elem of arguments) {
        result += Number(elem);
    }
    return result;
}

function getTotal(subTotal) {
    let total = subTotal + ((subTotal * consts.tax / 100));
    return Number(total.toFixed(2));
}


async function getResponse(vinNumber) {
    const apiLink = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/';
    const apiParameters = '?format=JSON'
    let apiFullLink = apiLink + vinNumber + apiParameters;

    let response = await fetch(apiFullLink);
    let content = await response.json();
    let str = `${content.Results[0].ModelYear} ${content.Results[0].Make} ${content.Results[0].Model}`;

    return str;
}
  
async function asyncCaller(vinNumber) {
    const result = await getResponse(vinNumber);
    vehicleName.value = result;
}

inputVinNumber.addEventListener('blur', function () {
    asyncCaller(inputVinNumber.value);
}); 

extraChargeCheckbox.addEventListener('change', function () {
    extraChargeInput.disabled = !extraChargeInput.disabled;

    if (extraChargeInput.disabled) {
        extraChargeInput.value = 0;
    }
});


fuelChargeCheckbox.addEventListener('change', function () {
    fuelChargeInput.disabled = !fuelChargeInput.disabled;

    if (fuelChargeInput.disabled) {
        fuelChargeInput.value = 0;
    }
});

withoutInstallationCheckbox.addEventListener('change', function () {
    fuelChargeCheckbox.disabled = withoutInstallationCheckbox.checked;
    fuelChargeInput.value = 0;

    modalReplacementPrice.classList.toggle('none');
    modalFuelChargePrice.classList.toggle('none');
});


function calculateGlassPrice(glassPrice, accessoriesPrice) {
    let result = Number(glassPrice.value);

    for (let elem of accessoriesPrice) {
        result += Number(elem.value);
    }

    return result;
}


getEstimateButton.addEventListener('click', function () {
    // Vehicle, part number name
    let vehicleName = document.querySelector('#vehicleName').value;
    let inputGlassPartNumber = document.querySelector('#inputGlassPartNumber').value;
    inputGlassPartNumber = inputGlassPartNumber.toUpperCase();
    modalVehicleName.textContent = `${vehicleName} | ${inputGlassPartNumber}`;

    // VIN number
    let vinNumber = inputVinNumber.value;
    modalVinNumber.textContent = `VIN #: ${vinNumber}`;

    
    // Glass type
    let glassTypeRadios = document.querySelectorAll('.glassType');
    let glassType = defineGlassType(glassTypeRadios);
    modalGlassType.textContent = `Glass type: ${glassType}`;


    // Glass, accessories price
    let glassPrice = document.querySelector('#glassPrice');
    let accessoriesPrice = document.querySelectorAll('.accessoryPrice');
    let modalGlassPrice = consts.glassProfit + calculateGlassPrice(glassPrice, accessoriesPrice);
    if (extraChargeCheckbox.checked) {
        modalGlassPrice += Number(extraChargeInput.value);
    }
    
    
    // Replacement price
    let replacementPrice = Number(getReplacementPrice(consts.pricing, selectVehicelType.value));
    
    
    // Fuel Charge
    let fuelChargePrice = fuelChargeInput.value;


    if (withoutInstallationCheckbox.checked) {
        let subTotal = getSubTotal(modalGlassPrice, fuelChargePrice);
        let total = getTotal(subTotal);


        modalGlassAndAccessoryPrice.textContent = `Glass & Accessories: $${modalGlassPrice}`;
        modalTotalPrice.textContent = `Total: $${total}(tax included)`;

    } else {
        let subTotal = getSubTotal(replacementPrice, modalGlassPrice, fuelChargePrice);
        let total = getTotal(subTotal);

        
        modalGlassAndAccessoryPrice.textContent = `Glass & Accessories: $${modalGlassPrice}`;
        modalReplacementPrice.textContent = `Replacement: $${replacementPrice}`;
        modalFuelChargePrice.textContent = `Fuel Charge: $${fuelChargePrice}`; 
        modalTotalPrice.textContent = `Total: $${total}(tax included)`;
    }
});




