if(typeof ClassNames == "undefined"){
  var ClassNames = {};
  ClassNames.Entry = "gs_r";
}

if(typeof IDs == "undefined"){
  var IDs = {};
  IDs.EntryList = "gs_ccl_results";
  IDs.CiteDisplay = "gs_citd";
  IDs.MainInterface = "gs_ccl";
}

if(typeof Attributes == "undefined"){
  var Attributes = {};
  Attributes.ID = "id";
  Attributes.Type = "type";
  Attributes.Style = "style";
  Attributes.Name = "name";
  Attributes.Value = "value";
  Attributes.Class = "class";
  Attributes.OnClick = "onclick";
}

if(typeof Events == "undefined"){
  var Events = {};
  Events.Click = "click";
}

if(typeof TagNames == "undefined"){
  var TagNames = {};
  TagNames.Input = "input";
  TagNames.Division = "div";
  TagNames.Anchor = "a";
}

var ToolBar = document.createElement(TagNames.Division);

var CheckBoxSelectAll = document.createElement(TagNames.Input);
CheckBoxSelectAll.setAttribute(Attributes.Type, "checkbox");
CheckBoxSelectAll.setAttribute(Attributes.ID, "checkboxselectall");
CheckBoxSelectAll.addEventListener(Events.Click, CheckboxSelectAllStateChange);
ToolBar.appendChild(CheckBoxSelectAll);

var LabelSelectAll = document.createTextNode("Select All Entries.");
ToolBar.appendChild(LabelSelectAll);

var ExportButton = document.createElement(TagNames.Input);
ExportButton.setAttribute(Attributes.Type, "button");
ExportButton.setAttribute(Attributes.Value, "Export Citations");
ExportButton.setAttribute(Attributes.Style, "margin-left:10pt");
ExportButton.addEventListener(Events.Click, ExportButtonClick);
ToolBar.appendChild(ExportButton);

var EntryList = document.getElementById(IDs.MainInterface);
EntryList.insertBefore(ToolBar, EntryList.firstChild);

var NodeList = document.getElementsByTagName(TagNames.Division); 
for(Index = 0; Index < NodeList.length; Index++){
    if (NodeList.item(Index).getAttribute('class') == ClassNames.Entry)    {
        var ControlBox = document.createElement("div");
        ControlBox.setAttribute(Attributes.Style, "float:left");
        var CheckBox = document.createElement(TagNames.Input);
        CheckBox.setAttribute(Attributes.Name, "checkboxliterature");
        CheckBox.setAttribute(Attributes.Type, "checkbox");
        ControlBox.appendChild(CheckBox);
        document.getElementById(IDs.EntryList).insertBefore(ControlBox, NodeList.item(Index));
        Index++;
    }
}

var ObservedElement = document.getElementById(IDs.CiteDisplay);
var Observer = new MutationObserver(OnElementChanged)
Observer.observe(ObservedElement, {childList:true, subtree:true});

var BibTeXLinkList = new Array();
var BibTeXLinkListLength = 0;
var ProcessedEntryCount = 0;

var BibTeXString = "";
var ResponseCount = 0;


function IsGoogleScholar(){
    // return document.documentElement.getAttribute("class") == "gs_el_sm";
}

function ExportButtonClick()
{
  BibTeXLinkList = new Array();
  ProcessedEntryCount = 0;

  var CheckBoxNodeList = document.getElementsByName("checkboxliterature");

  var LiteratureNodeList = document.getElementsByTagName(TagNames.Division);
  var LiteratureIndex = 0;
  for(i = 0; i < LiteratureNodeList.length; i++)
  {
    if (LiteratureNodeList.item(i).getAttribute(Attributes.Class) == ClassNames.Entry)
    {
      if (CheckBoxNodeList.item(LiteratureIndex).checked)
      {
        var LinkNodeList = LiteratureNodeList.item(i).getElementsByTagName(TagNames.Anchor);
        for (j = 0; j < LinkNodeList.length; j++)
        {
          var CiteButton = LinkNodeList.item(j);
          var OnClickString = LinkNodeList.item(j).getAttribute(Attributes.OnClick);
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