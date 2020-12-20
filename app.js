var masterData= {};
var _totalKeys;
var masterCost= {};


function activateName(keyword)
{
    let btn= document.getElementById('submitName');
    btn.disabled= keyword.value === ""? true:false;
}

function addName() {
    let names= document.getElementById('nameId');
    let display= document.getElementById('showNames');
    masterData[names.value]={bought: {}, paid: {} };
    names.value= "";
    var temp="";
    Object.keys(masterData).forEach( d=> {
        temp+= d+ "\n"
    })
    display.value= temp;
}
function submitAllName() {
    if(Object.keys(masterData).length === 0 && masterData.constructor === Object)
    {
        let shownamesarea= document.getElementById('showNames');
        shownamesarea.value="Names can't be empty";
        shownamesarea.style.color= "red";
        return;
    }
    document.getElementById('dataslotNames').style.display="none";
    document.getElementById('dataslotItems').style.display="block";
    _totalKeys= Object.keys(masterData).length;
}
function activateItem(keyword) {
    let btn= document.getElementById('submitItem');
    btn.disabled= keyword.value === ""? true:false;
    if(!btn.disabled) {
        var tempShare="";
        var tempPayer= "";
        Object.keys(masterData).forEach( d=> {
            tempShare+= `<div><input type="checkbox" id="${d}Cid" name="${d}Name" value="${d}"><label for="${d}Name">&ensp;${d.toUpperCase()}&ensp;</label></div>\n`;
            tempPayer+= `<div><input type="radio" id="${d}Pid" name="payerName" value="${d}"><label for="${d}Name">&ensp;${d.toUpperCase()}&ensp;</label></div>\n`;
        })
        document.getElementById('checkboxesSlot').innerHTML= tempShare;
        document.getElementById('checkboxesSlotPayer').innerHTML= tempPayer;
    }
}
function generateTableData() {
    var temp="";
    Object.keys(masterCost).forEach( d => {
        temp+= `<tr><td>${d}</td><td>${masterCost[d].cost}</td><td>${masterCost[d].share.toString().split(',').join(", ")}</td></tr>`;
    });
    document.getElementById('populateItemData').innerHTML= temp;
}
function addItem() {
    let tempShare= [];
    let checkboxCont= document.getElementById('checkboxesSlot');
    for (let index = 0; index < checkboxCont.children.length; index++) {
        const element = checkboxCont.children[index];
        element.children[0].checked? tempShare.push(element.children[0].value) : null;
    }
    if(tempShare.length === 0) {
        alert('Select at least one person -_-');
        return;
    }
    masterCost[document.getElementById('itemId').value]= {
        cost: document.getElementById('itemCostId').value,
        share: tempShare,
        payer: document.querySelector('input[name="payerName"]:checked').value
    };
    document.getElementById('itemId').value= document.getElementById('itemCostId').value= document.getElementById('checkboxesSlot').innerHTML= document.getElementById('checkboxesSlotPayer').innerHTML= "";
    generateTableData();
}

function mapObject() {
    Object.keys(masterCost).forEach( d => {
        let share= masterCost[d].cost/masterCost[d].share.length;
        masterCost[d].share.forEach( p => {
            masterData[p]['bought'][d]= share;
        });
        masterData[masterCost[d].payer]['paid'][d]= masterCost[d].cost;
    });

    Object.keys(masterData).forEach( d => {
        let s=0;
        Object.keys(masterData[d]['bought']).forEach( item => {
            s+= Number(masterData[d]['bought'][item]);
        });
        masterData[d]['totalSpent']= s;
    })

    Object.keys(masterData).forEach( d => {
        let s=0;
        Object.keys(masterData[d]['paid']).forEach( item => {
            s+= Number(masterData[d]['paid'][item]);
        });
        masterData[d]['totalPaid']= s;
    });
    displaySummary();
}

function calculateTotalSpent() {
    let TA= document.getElementById('totalAmount');
    let s=0;
    Object.keys(masterCost).forEach( d => {
        s+= Number(masterCost[d].cost);
    });
    TA.innerText= s;
}

function displaySummary()
{
    let insertHere= document.getElementById('populateShareData');
    document.getElementById('dataslotItems').style.display= 'none';
    document.getElementById('showMasterSplit').style.display='block';
    let str='';
    Object.keys(masterData).forEach(d=> {
        str+= `<tr><td>${d}</td><td>${masterData[d].totalSpent-masterData[d].totalPaid}</td><td>${masterData[d].totalPaid}</td><td onclick="generateIndividualDetails('${d}')">Details</td></tr>`
    })
    insertHere.innerHTML= str
}

function generateIndividualDetails(name) {
    let targetData= masterData[name];
    function objToString (obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + ':&emsp;' + obj[p] + '<br>';
            }
        }
        return str;
    }

    let temp= `Details of <b>${name}</b><br><br>`;
    temp+= `Money Spent Details- <br>${objToString(targetData['bought'])}`;
    temp+= `<br>`;
    temp+= `Money Paid Details- <br>${objToString(targetData['paid'])}`;
    temp+= `<br>`;
    temp+= `Total Spent: ${targetData['totalSpent']} <br>`;
    temp+= `Total Paid: ${targetData['totalPaid']}<br>`;
    temp+= targetData['totalSpent']-targetData['totalPaid'] < 0 ? `Collect ${-targetData['totalSpent']+targetData['totalPaid']}` : `Pay ${targetData['totalSpent']-targetData['totalPaid']}`;

    document.getElementById('includeDetailData').innerHTML= temp;
}