const {Path, Text, Rectangle, Ellipse, Line, Polygon, Group} = require("scenegraph");

function createControl(item) {

    if (item != null) {
        var type = getControlType(item);
        console.log("creating " + type);
        var result = "";
        var ele = "";
        var generalProps = " ";
        var margin = getMargin(item);
        var width = item.globalDrawBounds.width;
        var height = item.globalDrawBounds.height;

        // general properties
        ele = "\t\t<" + type;
        generalProps += "Width=\"" + width + "\"";
        generalProps += " Height=\"" + height + "\"";
        generalProps += " Margin=\"" + margin + "\"";

        if (type == "RatingControl") {
            ele + " " + generalProps + "/>";
        }

        //specific proeprties
        var children = item.children;
        console.log(children.length);

        var result = "";
        var specificProps = "";

        //console.log("general properties retireved" + generalProps);

        if(children.length > 1) {
            children.forEach(function (element, i) {
                //console.log("Child " + i + " is a " + element.constructor.name);
                
                if (element instanceof Rectangle) {
                    specificProps += getControlShapeProperties("Rectangle", element);
                }
                else if (element instanceof Ellipse) {
                    //console.log(element);
                    specificProps += createtShape("Ellipse", element);
                }
                else if (element instanceof Polygon) {
                    specificProps += createtShape("Polygon", element);
                }
                else if (element instanceof Line) {
                    //console.log(element);
                    specificProps += createtShape("Line", element);
                }
                else if (element instanceof Text) {
                    specificProps += getControlTextProperties(type, element);
                    //console.log("text proeprties retrieved: prop= " + specificProps);
                }
                else if (element instanceof Path) {
                    //console.log("Path:" + element.name);
                    if (element.name != "Footprint") {
                        //specificProps += " Background=\"#" + element.fill.value.toString(16) + "\"";
                        specificProps += getControlPathProperties(element, type);
                        console.log(element.name + " : " + specificProps);
                    }
                }
                else if (element instanceof Group) {
                    specificProps += getControlPropertiesFromGroup(element, type);
                    console.log("Group proeprties retrieved: prop= " + specificProps);
                }

              
                //props += prop;
                //console.log(props);
            });
            //result += props + "\n";
            //console.log("iteraing throug hchildren finished:" + specificProps);

        }
        else{
            //return "";
            //console.log("item has no children");
        }
    
    
        // switch (type) {
        //     case "Button":
        //         props += getButtonProperties(item);
        //         break;
        //     case "CheckBox":
        //         props += getCheckBoxProperties(item);
        //         break;
            
        //     default:
        //         break;
        // }
        result = ele + " " + generalProps + specificProps + "/>";
        //console.log(result);
        //console.log(specificProps);

        return result;
    }
}

function getControlType(item) {
    var name = item.name;
    if(name.includes("HyperlinkButton") || name.includes("Hyperlink Button")) return "HyperlinkButton";
    else if(name.includes("Button") && !name.includes("Radio")) return "Button";
    else if(name.includes("CheckBox") || name.includes("Check Box")) return "CheckBox";
    else if(name.includes("RadioButton") || name.includes("Radio Button")) return "RadioButton";
    else if(name.includes("TextBox") || name.includes("Text Box")) return "TextBox";
    else if(name.includes("CombotBox") || name.includes("Combo Box")) return "ComboBox";
    else if(name.includes("Rating")) return "RatingControl";
    else if(name.includes("Slider")) return "Slider";
}

function getControlTextProperties(tag, item) {
    console.log("getting text property of: " + tag);
    var prop = "";
    //console.log(prop);
    var txt = item.text;
    if(txt.includes("header")) {
        prop += " Header=\"" + txt + "\"";
    }
    else if (txt.includes("Hint") || txt.includes("placeholder")) {
        prop += " PlaceholderText=\"" + txt + "\"";
    }
    else if (tag == "ComboBox") {
        prop += " PlaceholderText=\"" + txt + "\"";
    }
    else {
        console.log(prop);
        prop += " Content=\"" + txt + "\"";
        prop += " Foreground=\"#" + item.fill.value.toString(16) + "\"";
        prop += " FontSize=\"" + item.fontSize + "\"";
    }

    //console.log(prop);

    return prop;


    switch (tag) {
        case "Button":
            return prop;
        case "CheckBox":
            return prop;
        default:
            return "";
    }
}

function getControlShapeProperties(item) {
    console.log("getting shapes property of: " +item.name);

    //hyperlink button
    return "";
}

function getControlPathProperties(item, tag) {
    var prop = "";
    //console.log(prop);
    var pathName = item.name;
    console.log(pathName);

    if(pathName.includes("Base")) prop += " Background=\"#" + item.fill.value.toString(16) + "\"";
    else if(pathName.includes("Indicator")) prop += " Foreground=\"#" + item.fill.value.toString(16) + "\"";
    else if(pathName.includes("Track")) prop += " Background=\"#" + item.fill.value.toString(16) + "\"";

    return prop;

}

function getControlPropertiesFromGroup(item, tag) {
    //slider
    var props = "";
    item.children.forEach(ele => {
        if (ele instanceof Path) {
            //console.log("Path:" + ele.name);
            if (ele.name != "Footprint") {
                //specificProps += " Background=\"#" + ele.fill.value.toString(16) + "\"";
                props += getControlPathProperties(ele, tag);
                console.log(ele.name + " : " + props);
            }
        }
    });
    
    return props;

}


// function getButtonProperties(item) {
//     var children = item.children;
//     var result = "";
//     var prop = "";

//     if(children.length > 1) {
//         console.log("item has many children");
//         children.forEach(element => {
//             console.log(element.name + "....");

//             if (element instanceof Rectangle) {
//                 prop = createtShape("Rectangle", element);
//             }
//             else if (element instanceof Ellipse) {
//                 //console.log(element);
//                 prop = createtShape("Ellipse", element);
//             }
//             else if (element instanceof Polygon) {
//                 prop = createtShape("Polygon", element);
//             }
//             else if (element instanceof Line) {
//                 //console.log(element);
//                 prop = createtShape("Line", element);
//             }
//             else if (element instanceof Text) {
//                 var txt = element.text;
//                 prop = " Content=\"" + txt + "\"";
//                 prop += " Foreground=\"#" + element.fill.value.toString(16) + "\"";
//                 prop += " FontSize=\"" + element.fontSize + "\"";
//             }
//             else if (element instanceof Path) {
//                 prop = " Background=\"#" + element.fill.value.toString(16) + "\"";
//             }

//             else if (element instanceof Group) {
//                 prop = createControl(element);
//             }

          
//             result += prop;
//         });
//         return result + "\n";
//     }
//     else{
//         return "";
//         console.log("item has no children");
//     }

// }

function getMargin(item) {
    var x = item.globalDrawBounds.x;
    var y = item.globalDrawBounds.y;
    return x.toString() +","+ y.toString() + ",0,0";
}

module.exports = {
    CreateControl: createControl,
};
