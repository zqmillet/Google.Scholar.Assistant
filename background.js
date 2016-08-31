if (document.title.indexOf("学术搜索") != -1) 
{
  var List = document.getElementById("gs_ccl");
  var ToolBar = document.createElement("div");
  var CheckBox = document.createElement("input");
  CheckBox.setAttribute("type", "checkbox");
  CheckBox.setAttribute("id", "checkboxselectall");
  CheckBox.addEventListener("click", CheckboxSelectAllStateChange);

  var Label = document.createTextNode("Select All Literatures.");
  var ExportButton = document.createElement("input");
  ExportButton.setAttribute("type", "button");
  ExportButton.setAttribute("value", "Export Citations");
  ExportButton.setAttribute("style", "margin-left:10pt");
  // ExportButton.setAttribute("onclick", "ExportButtonClick();");
  ExportButton.addEventListener("click", ExportButtonClick);
  ToolBar.appendChild(CheckBox);
  ToolBar.appendChild(Label);
  ToolBar.appendChild(ExportButton);
  List.insertBefore(ToolBar, List.firstChild);

  var NodeList = document.getElementsByTagName("div"); 
  for(i = 0; i < NodeList.length; i++)
  {
    if (NodeList.item(i).getAttribute('class') == 'gs_r')
    {
      var ControlBox = document.createElement("div");
      ControlBox.setAttribute("style", "float:left");
      var CheckBox = document.createElement("input");
      CheckBox.setAttribute("name", "checkboxliterature");
      CheckBox.setAttribute("type", "checkbox");
      ControlBox.appendChild(CheckBox);
      document.getElementById("gs_ccl").insertBefore(ControlBox, NodeList.item(i));
      i += 1;
    }
  }
}

function ExportButtonClick()
{
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
          var LinkString = LinkNodeList.item(j).getAttribute("href");
          if (LinkString == null)
            continue;
          
          if (LinkString.indexOf("scholar?q=related") == -1)
            continue;

          // LinkNodeList.item(j).click();
          LinkString = LinkString.substring(LinkString.indexOf(":") + 1, LinkString.length - 1);
          LinkString = LinkString.substring(0, LinkString.indexOf(":"));
          alert(gs_ocit(event,LinkString,'0'));
          
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