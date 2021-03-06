let output = "";
const {Rectangle, Ellipse, Text, Polygon, Line, Color, SymbolInstance, Group, Path, Artboard} = require("scenegraph");
const {CreateControl, CreateTextBlock} = require("./HtmlControl.js");
const {CreateShape} = require("./HtmlShape.js");
const {CreateLayout} = require("./HtmlLayout.js");
const {CreateBlazorise} = require("./blazorise.js");

let lastTab = 0;

function convert(selection) {
    var children = selection.children;
    var page = "";
    var header = "<head>";
    header += "\n<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl\" crossorigin=\"anonymous\">";
    header += "\n</head>";

    if(selection instanceof Artboard){
        page = "<!DOCTYPE html>\n";
        page += "<html>\n";
        page += header + "\n<body>";
    }else{
        page = "<div>";
    }

    output = page;
    var tab = "";
    var tag = "";

    if(children.length > 1) {
        children.forEach(item => {
            tab = getTabPosition(4);
            tag = createElement(item);
         
            output += "\n" + tab + tag;
        });
    }
    else{

        output += "\n" + createElement(selection) + "\n";
    }

    if(selection instanceof Artboard){
        var ending = "\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0\" crossorigin=\"anonymous\"></script>";
        
        return output += ending + "\n\t</body>\n</html>";
    }else{
        return output += "\n\t</div>\n";
    }

}

function createElement(element) {
        
    if (element instanceof Rectangle) return CreateShape("rect", element);
        
    else if (element instanceof Ellipse) {
        return CreateShape("ellipse", element);
    }
    else if (element instanceof Polygon) {
        return CreateShape("polygon", element);
    }
    else if (element instanceof Line) {
        return CreateShape("line", element);
    }
    else if (element instanceof Text && element.name.includes("Hyperlink")) {
        return CreateControl(element);
    }
    else if (element instanceof Text) {
        return CreateTextBlock(element);
    }
    else if (element instanceof SymbolInstance && isControl(element.name)) {
        return CreateCustomeControl(element);
    }
    else if (element instanceof SymbolInstance && isLayout(element.name)) {
        return CreateLayout(element);
    }
    else if (element instanceof SymbolInstance) {
        return CreateControl(element);
    }
    else if (element instanceof Group) {
        return CreateLayout(element);
    }
    else{
        return "";
    }
}

function isControl(type) {
    var conditions = ["Text Box", "Combo Box", "Slider", "Switch", "Rating"];
    return conditions.some(el => type.includes(el));
}

function isLayout(name) {
    var nam = name.toLowerCase().split(" ").join("");
    var conditions = ["pagetitle"];
    return conditions.some(el => nam.includes(el));
}

function getTabPosition(spaces) {
    lastTab = spaces;
    var  res = "";
    for (let index = 0; index < spaces; index++) {
        res += " ";
    }
    return res;
}

function CreateCustomeControl(ele) {
    var cfk = window.localStorage.getItem("component_framework");
    if (cfk == "blazorise") return CreateBlazorise(ele);
}

module.exports = {
    ConvertHTML: convert,
};
