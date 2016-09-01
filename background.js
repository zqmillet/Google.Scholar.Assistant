if (!IsGoogleScholar())
  exit();

var ToolBar = document.createElement("div");

var CheckBoxSelectAll = document.createElement("input");
CheckBoxSelectAll.setAttribute("type", "checkbox");
CheckBoxSelectAll.setAttribute("id", "checkboxselectall");
CheckBoxSelectAll.addEventListener("click", CheckboxSelectAllStateChange);
ToolBar.appendChild(CheckBoxSelectAll);

var LabelSelectAll = document.createTextNode("Select All Entries.");
ToolBar.appendChild(LabelSelectAll);

var ExportButton = document.createElement("input");
ExportButton.setAttribute("type", "button");
ExportButton.setAttribute("value", "Export Citations");
ExportButton.setAttribute("style", "margin-left:10pt");
ExportButton.addEventListener("click", ExportButtonClick);
ToolBar.appendChild(ExportButton);

var EntryList = document.getElementById("gs_ccl");
EntryList.insertBefore(ToolBar, EntryList.firstChild);

var NodeList = document.getElementsByTagName("div"); 
for(Index = 0; Index < NodeList.length; Index++){
    if (NodeList.item(Index).getAttribute('class') == 'gs_r')    {
        var ControlBox = document.createElement("div");
        ControlBox.setAttribute("style", "float:left");
        var CheckBox = document.createElement("input");
        CheckBox.setAttribute("name", "checkboxliterature");
        CheckBox.setAttribute("type", "checkbox");
        ControlBox.appendChild(CheckBox);
        document.getElementById("gs_ccl_results").insertBefore(ControlBox, NodeList.item(Index));
        Index++;
    }
}

var ObservedElement = document.getElementById("gs_citd");
var Observer = new MutationObserver(OnElementChanged)
Observer.observe(ObservedElement, {childList:true, subtree:true});

var BibTeXLinkList = new Array();
var BibTeXLinkListLength = 0;
var ProcessedEntryCount = 0;

var BibTeXString = "";
var ResponseCount = 0;

function IsGoogleScholar(){
    return document.documentElement.getAttribute("class") == "gs_el_sm";
}

function ExportButtonClick()
{
  BibTeXLinkList = new Array();
  ProcessedEntryCount = 0;

  var CheckBoxNodeList = document.getElementsByName("checkboxliterature");

  var LiteratureNodeList = document.getElementsByTagName("div");
  var LiteratureIndex = 0;
  for(i = 0; i < LiteratureNodeList.length; i++)
  {
    if (LiteratureNodeList.item(i).getAttribute('class') == 'gs_r')
    {
      if (CheckBoxNodeList.item(LiteratureIndex).checked)
      {
        var LinkNodeList = LiteratureNodeList.item(i).getElementsByTagName('a');
        for (j = 0; j < LinkNodeList.length; j++)
        {
          var CiteButton = LinkNodeList.item(j);
          var OnClickString = LinkNodeList.item(j).getAttribute("onclick");
          if (OnClickString == null)
            continue;
          if (OnClickString.indexOf("gs_ocit") == -1)
            continue;

          ProcessedEntryCount ++;
          LinkNodeList.item(j).click();          
        }        
      } 
      LiteratureIndex++;
    }
  }
}

function CheckboxSelectAllStateChange()
{
  var NodeList = document.getElementsByName("checkboxliterature");
  var Checked = document.getElementById("checkboxselectall").checked;
  for(i = 0; i < NodeList.length; i++)
  {
    NodeList.item(i).checked = Checked;
  }
}

function OnElementChanged(records)
{
  var Node = document.getElementById('gs_citi');
  if (Node == null)
    return;

  BibTeXLinkList.push(Node.firstChild.getAttribute("href"));
  ProcessedEntryCount --;
  if (ProcessedEntryCount)
    return;
  
  BibTeXLinkListLength = BibTeXLinkList.length;
  ResponseCount = 0;
  BibTeXString = "";
  while (BibTeXLinkList.length > 0)
    GetBibTeX(BibTeXLinkList.pop()); 
}

function GetBibTeX(Url)
{
    var Request = new XMLHttpRequest();
    Request.open('GET', Url, true);
    Request.onreadystatechange = function(){ReadyStateChange(Request);};
    Request.send(null);
}

function ReadyStateChange(Request) 
{
  if (Request.readyState == XMLHttpRequest.DONE && Request.status == 200)
  {
    ResponseCount++;
    BibTeXString += Request.responseText;
    if (ResponseCount == BibTeXLinkListLength){
      window.open("data:text/json;charset=utf-8," + escape(BibTeXString));
    }
  }
}

