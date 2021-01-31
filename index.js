d3.csv("data.csv").then(function (dataset) {
    //#region ConstructDropDownBox
    //#region  questionDict
    // questions about life
    const questionsDict_life = {
        default: "Select a question about Personal Life...",
        gender: "Male or Female?",
        nation: "Where do they come from?",
        glass: "Do they wear glasses?",
        zodiac: "What are the zodiac signs of them?",
        young: "What were they looked like when they were young/ younger?",
        old: "Which of them had passed away?",
    }
    const questions_life = Object.values(questionsDict_life)
    const keys_life = Object.keys(questionsDict_life)

    // questions about education
    const questionsDict_education = {
        default: "Select a question about Education...",
        educationGeneral: "Did they receive degrees in architecture?",
        educationDegree: "What is the highest degree they received?",
        educationAbroad: "Did they learn architecture design in the college abroad?",
        teach: "Had they taught in the colleges?",

    }
    const questions_education = Object.values(questionsDict_education)
    const keys_education = Object.keys(questionsDict_education)

    // questions about prize
    const questionsDict_career = {
        default: "Select a question about Career...",
        otherCareer: "Did they consider other careers before becoming an architect?",
        travel: "Were there some important trips mentioned in their biography?",
        work: "Did they work with/for other laureates?",
        esTime: "When did they establish their own practice after graduation?",
        wonTime: "When did they receive the prize after starting their own practice?",
        age: "How old were they when they won the prize?",
    }

    const questions_career = Object.values(questionsDict_career)
    const keys_career = Object.keys(questionsDict_career)
    //#endregion   
    const valueSelection = ["selected"]
    const categorySelected = d3.select("#questionSelect_categories")

    const questionSelect_life = d3.select("#questionSelect_update")
    const questionOptions_life = questionSelect_life.selectAll("option")
        .data(questions_life)
        .enter().append("option")
        .text(function (d) {
            return d;
        })
        .attr("value", (d, i) => keys_life[i])
        .attr("class", "option_update")

    questionSelect_life.on("change", updateGridImages)

    categorySelected
        .on("change", UpdateQuestionGroup)

    // show the intro of "Personal Life" by default
    const introOfLife = d3.select("#updatedIntro_life");
    const introOfEducation = d3.select("#updatedIntro_education")
    const introOfCareer = d3.select("#updatedIntro_career")
    const divOfUpdatedInfo_detailed = d3.select("#divOfUpdatedInfo_detailed")
    introOfLife.style("visibility", "visible");

    var selectedCategory = "life";

    function UpdateQuestionGroup() {
        ResetImgGallery();
        ResetHoverOverInfo();

        architect.attr("class", "architect")

        var SelectedCategory = d3.select(this).property("value")
        selectedCategory = SelectedCategory;

        if (SelectedCategory == "life") {
            $("option").remove(".option_update");
            const questionSelect_life = d3.select("#questionSelect_update")
            const questionOptions_life = questionSelect_life.selectAll("option")
                .data(questions_life)
                .enter().append("option")
                .text(function (d) {
                    return d;
                })
                .attr("value", (d, i) => keys_life[i])
                .attr("class", "option_update")

            questionSelect_life.on("change", updateGridImages);
            CleanIntro();
            introOfLife.style("visibility", "visible");


        } else if (SelectedCategory == "education") {
            $("option").remove(".option_update");
            const questionSelect_education = d3.select("#questionSelect_update")
            const questionOptions_education = questionSelect_education.selectAll("option")
                .data(questions_education)
                .enter().append("option")
                .text(function (d) {
                    return d;
                })
                .attr("value", (d, i) => keys_education[i])
                .attr("class", "option_update")

            questionSelect_education.on("change", updateGridImages);
            CleanIntro();
            introOfEducation.style("visibility", "visible");

        } else if (SelectedCategory == "career") {
            $("option").remove(".option_update");
            const questionSelect_career = d3.select("#questionSelect_update")
            const questionOptions_career = questionSelect_career.selectAll("option")
                .data(questions_career)
                .enter().append("option")
                .text(function (d) {
                    return d;
                })
                .attr("value", (d, i) => keys_career[i])
                .attr("class", "option_update")
                .attr("text-decoration", "underline")

            questionSelect_career.on("change", updateGridImages)
            CleanIntro();
            introOfCareer.style("visibility", "visible");
        }

        function ResetImgGallery() {
            defaultTexts.text(textsOfDefault_0)

            pictures
                .attr("class", "otherProperty default")
                .attr("src", d => "img/default/" + d.default+".png")
            SelectedQuestion = "default"
        }

        function ResetHoverOverInfo() {
            divOfUpdatedInfo_detailed.attr("class", "divOfUpdatedInfo_detailed")
        }
    }

    function CleanIntro() {
        jQuery(".updatedIntro").css("visibility", "hidden");
    }

    //#region results of OptionChanged
    var SelectedQuestion;
    const questionsWithMoreInfo = [
        "educationGeneral",
        "educationAbroad",
        "otherCareer",
        "travel",
        "work",
        "esTime",
    ]

    function updateGridImages() {

        // get the "value" of the selected option
        var selectedQuestion = d3.select(this).property("value")
        CleanIntro();
        if (selectedQuestion == "default") {
            if (selectedCategory == "life") {
                introOfLife.style("visibility", "visible");
            } else if (selectedCategory == "education") {
                introOfEducation.style("visibility", "visible");
            } else if (selectedCategory == "career") {
                introOfCareer.style("visibility", "visible");
            }
        } else {
            d3.select("#updatedIntro_" + selectedQuestion).style("visibility", "visible")
        }

        // pass the selected option to "SelectedQuestion"
        SelectedQuestion = selectedQuestion;
        update(selectedQuestion);

        // change class name when change default option
        if (selectedQuestion == "default") {
            architect.attr("class", "architect")
        } else {
            architect.attr("class", "Architect")
        }

        if ($.inArray(selectedQuestion, questionsWithMoreInfo) != -1) {
            divOfUpdatedInfo_detailed.attr("class", "divOfUpdatedInfo_detailed")
            defaultTexts.text(textsOfDefault)
        } else {
            defaultTexts.text(textsOfDefault_0)
            divOfUpdatedInfo_detailed.attr("class", "divOfUpdatedInfo_detailed")
        }
    }

    function update(selectedOption) {
        pictures
            .attr("class", "otherProperty " + selectedOption)
            .attr("src", d => "img/" + selectedOption + "/" + d[selectedOption] + ".png")
    }
    //#endregion

    //#region ConstructImgGallery
    // construct image gallery
    const index = d => d.index;
    let portraitsContainer = d3.select('#portraitsContainer');
    let nest = d3.nest()
        .key(function (d) {
            return d.name;
        })
        .entries(dataset);

    let section = portraitsContainer
        .append("div")
        .attr("id", "section")
        .attr("class", "section");

    let architect = section.selectAll('div')
        .data(nest)
        .enter().append('div')
        .attr("id", "architect")
        .attr("class", "architect");

    let pictures = architect.selectAll('img')
        .data(function (d) {
            return d.values;
        })
        .enter().append('img')
        .attr("class", "otherProperty default")
        .attr("id", d => "img" + d.index)
        .attr("src", d => "img/" + keys_life[0] + "/" + d.default+".png")
        .on("mouseenter", ShowInfo)
        .on("mouseout", DismissInfo);
    //#endregion

    //#region results of ImgHovered 
    //#region selectUpdatedArea
    // educationGeneral & educationAbroad
    const textsOfDefault = "Hover over to learn more info ..."
    const textsOfDefault_0 = "Hover over to see who they are ..."
    const defaultTexts = d3.select("#defaultTexts").text("Hover over to see who they are ...")
    const education_U1 = d3.select("#education_U1").data(dataset)
    const education_A1 = d3.select("#education_A1").data(dataset)
    const education_U2 = d3.select("#education_U2").data(dataset)
    const education_A2 = d3.select("#education_A2").data(dataset)
    const education_U3 = d3.select("#education_U3").data(dataset)
    const education_A3 = d3.select("#education_A3").data(dataset)
    const education_O = d3.select("#educationAbroad_O").data(dataset)
    const educationArray = [education_U1, education_U2, education_U3, education_A1, education_A2, education_A3, education_O]
    // otherCareer
    const otherCareer_O1 = d3.select("#otherCareer_O1").data(dataset)
    const otherCareer_role1_r = d3.select("#otherCareer_role1_r").data(dataset)
    const otherCareer_role1_b = d3.select("#otherCareer_role1_b").data(dataset)
    const otherCareer_role1_g = d3.select("#otherCareer_role1_g").data(dataset)
    const otherCareer_O2 = d3.select("#otherCareer_O2").data(dataset)
    const otherCareer_role2_r = d3.select("#otherCareer_role2_r").data(dataset)
    const otherCareer_role2_b = d3.select("#otherCareer_role2_b").data(dataset)
    const otherCareerArray = [otherCareer_O1, otherCareer_O2, otherCareer_role1_r, otherCareer_role1_b, otherCareer_role1_g, otherCareer_role2_r, otherCareer_role2_b]
    // travel
    const travel_O1 = d3.select("#travel_O1").data(dataset)
    const travel_location1 = d3.select("#travel_location1").data(dataset)
    const travel_O2 = d3.select("#travel_O2").data(dataset)
    const travel_works = d3.select("#travel_works").data(dataset)
    const travel_O3 = d3.select("#travel_O3").data(dataset)
    const travel_figures = d3.select("#travel_figures").data(dataset)
    const travel_O4 = d3.select("#travel_O4").data(dataset)
    const travel_location2 = d3.select("#travel_location2").data(dataset)
    const travel_O5 = d3.select("#travel_O5").data(dataset)
    const travelArray = [travel_O1, travel_O2, travel_O3, travel_O4, travel_O5, travel_location1, travel_location2, travel_works, travel_figures]
    // esTime
    const thingsDone_studied = d3.select("#ThingsDone_studied").data(dataset)
    const thingsDone_worked = d3.select("#ThingsDone_worked").data(dataset)
    const thingsDone_traveled = d3.select("#ThingsDone_traveled").data(dataset)
    const thingsDone_taught = d3.select("#ThingsDone_taught").data(dataset)
    const thingsDone_O1 = d3.select("#ThingsDone_O1").data(dataset)
    const thingsDoneArray = [thingsDone_studied, thingsDone_worked, thingsDone_traveled, thingsDone_taught, thingsDone_O1]
    //#endregion
    const workTogetherDict = {
        2: "2019",
        9: "2014",
        10: "2013",
        12: "2011",
        13: "2010_1",
        14: "2010_2",
        17: "2007",
        20: "2004",
        21: "2003",
        26: "1999",
        25: "2000",
        27: "1998",
        28: "1997",
        29: "1996",
        33: "1992",
    }
    const keys_workTogether = Object.keys(workTogetherDict)
    const newWorkTogetherArray = [];
    var i;
    for (i = 0; i < keys_workTogether.length; i++) {
        newWorkTogetherArray[i] = "img" + keys_workTogether[i]
    }
    console.log(newWorkTogetherArray)

    var ImgPath;
    var ImgId;
    var ImgRelated_1;
    var ImgRelated_2;
    var ImgRelatedPath_1;
    var ImgRelatedPath_2;

    function ShowInfo(d) {
        var imgPath = d3.select(this).property("src");
        var imgId = d3.select(this).property("id");
        ImgPath = imgPath;
        ImgId = imgId;
        //console.log(ImgPath)
        // show tooltip
        d3.select("#tooltip" + index(d)).style("opacity", 0.9);
        // show photo
        d3.select("#img" + index(d))
            .attr("src", "img/default/" + d.default+".png")

        if (SelectedQuestion == "work" && $.inArray(imgId, newWorkTogetherArray) != -1) {
            switch (imgId) {
                // 2019 & 2014
                case "img9":
                    ImgRelated_1 = "2";
                    break;
                    // 2013 & 2010
                case "img10":
                    ImgRelated_1 = "13";
                    break;
                case "img13":
                    ImgRelated_1 = "10";
                    ImgRelated_2 = "14";
                    break;
                case "img14":
                    ImgRelated_2 = "13";
                    break;
                    // 2011 & 1992
                case "img12":
                    ImgRelated_1 = "33";
                    break;
                case "img33":
                    ImgRelated_1 = "12"
                    break;
                    // 1998 & 1999 & 2007
                case "img17":
                    ImgRelated_1 = "26";
                    ImgRelated_2 = "27";
                    break;
                case "img26":
                    ImgRelated_1 = "17";
                    break;
                case "img27":
                    ImgRelated_1 = "17";
                    break;
                    // 2004 & 2000
                case "img20":
                    ImgRelated_1 = "25";
                    break;
                case "img25":
                    ImgRelated_1 = "20";
                    break;
                    // 2003 & 1997 & 1996
                case "img21":
                    ImgRelated_1 = "28";
                    ImgRelated_2 = "29";
                    break;
                case "img28":
                    ImgRelated_1 = "21";
                    break;
                case "img29":
                    ImgRelated_1 = "21";
                    break;
                default:
                    break;
            }
            triggerRelatedImg();

            function triggerRelatedImg() {
                ImgRelatedPath_1 = "img/default/" + workTogetherDict[ImgRelated_1] + ".png";
                ImgRelatedPath_2 = "img/default/" + workTogetherDict[ImgRelated_2] + ".png"
                d3.select("#img" + ImgRelated_1).attr("src", ImgRelatedPath_1);
                d3.select("#img" + ImgRelated_2).attr("src", ImgRelatedPath_2);
            }

        }

        // extract more info by hovering over
        if (SelectedQuestion == "educationGeneral") {
            defaultTexts.text("")
            education_U1.text(">> " + d.educationGeneral_U1)
            education_A1.text(d.educationGeneral_A1)
            education_U2.text(d.educationGeneral_U2)
            education_A2.text(d.educationGeneral_A2)
            education_U3.text(d.educationGeneral_U3)
            education_A3.text(d.educationGeneral_A3)
        } else if (SelectedQuestion == "educationAbroad") {
            defaultTexts.text("")
            checkEducationAbroad(d.educationAbroad_img)

            function checkEducationAbroad(data) {
                if (data != "") {
                    educationAbroad_img = d3.select("#divOfEducationAbroad")
                        .append("img")
                        .attr("id", "educationAbroad_img")
                        .attr("class", "educationAbroad_img")
                    educationAbroad_img
                        .data(dataset)
                        .attr("src", "img/educationAbroad_img/" + data + ".png")
                }
            }
            education_O.text(d.educationAbroad_O)
            if (d.educationAbroad_U1 != "") {
                education_U1.text(">> " + d.educationAbroad_U1)
            }
            education_A1.text(d.educationAbroad_A1)
            education_U2.text(d.educationAbroad_U2)
            education_A2.text(d.educationAbroad_A2)
            education_U3.text(d.educationAbroad_U3)
            education_A3.text(d.educationAbroad_A3)

        } else if (SelectedQuestion == "otherCareer") {
            defaultTexts.text("")
            otherCareer_O1.text(d.otherCareer_O1)
            otherCareer_role1_r.text(d.otherCareer_role1_r)
            otherCareer_role1_b.text(d.otherCareer_role1_b)
            otherCareer_role1_g.text(d.otherCareer_role1_g)
            otherCareer_O2.text(d.otherCareer_O2)
            otherCareer_role2_r.text(d.otherCareer_role2_r)
            otherCareer_role2_b.text(d.otherCareer_role2_b)
        } else if (SelectedQuestion == "travel") {
            defaultTexts.text("")
            travel_O1.text(d.travel_O1)
            travel_location1.text(d.travel_location1)
            travel_O2.text(d.travel_O2)
            travel_works.text(d.travel_works)
            travel_O3.text(d.travel_O3)
            travel_figures.text(d.travel_figures)
            travel_O4.text(d.travel_O4)
            travel_location2.text(d.travel_location2)
            travel_O5.text(d.travel_O5)
        } else if (SelectedQuestion == "esTime") {
            defaultTexts.text("")
            thingsDone_studied.text(d.thingsDone_studied)
            thingsDone_worked.text(d.thingsDone_worked)
            thingsDone_traveled.text(d.thingsDone_traveled)
            thingsDone_taught.text(d.thingsDone_taught)
            thingsDone_O1.text(d.thingsDone_O1)
        }
    }

    function DismissInfo(d) {
        // dismiss tooltip
        d3.select("#tooltip" + index(d)).style("opacity", 0);
        // dismiss img 
        d3.select("#img" + index(d))
            .attr("src", ImgPath)
        const yImgPath = "img/work/N.png"
        if (SelectedQuestion == "work") {

            if (ImgId == "img9") {
                d3.select("#img" + ImgRelated_1)
                    .attr("src", yImgPath);
                d3.select("#img" + ImgRelated_2)
                    .attr("src", yImgPath);
            } else {
                d3.select("#img" + ImgRelated_1)
                    .attr("src", ImgPath);
                d3.select("#img" + ImgRelated_2)
                    .attr("src", ImgPath);
            }
        }
        if ($.inArray(SelectedQuestion, questionsWithMoreInfo) != -1) {
            d3.select("#educationAbroad_img").remove();
            educationArray.forEach(removeTexts);
            otherCareerArray.forEach(removeTexts);
            travelArray.forEach(removeTexts);
            thingsDoneArray.forEach(removeTexts);
            defaultTexts.text(textsOfDefault);

            function removeTexts(element) {
                element.text("")
            }
        }
        ImgRelated_1 = null;
        ImgRelated_2 = null;
    }

    //#endregion

    //#region BuildingTooltip
    // add a tooltip to each architect
    let tooltip = architect
        .append('g')
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

    $("#section img")
        .each(function (i) {
            $("#tooltip")
                .attr("id", "tooltip" + i)
                .appendTo($(this).parent());
        });

    // add name to tooltip
    let tooltipName = tooltip
        .append('div')
        .attr("class", "tooltipName");
    let name = tooltipName.selectAll("text")
        .data(function (d) {
            return d.values;
        })
        .enter().append("text")
        .attr("id", "name")
        .text((d) => d.name)

    // add year to tooltip
    let tooltipYear = tooltip
        .append('div')
        .attr("class", "tooltipYear")
    let year = tooltipYear.selectAll("text")
        .data(function (d) {
            return d.values;
        })
        .enter().append("text")
        .attr("id", "year")
        .text((d) => d.year + "  Laureate");
    //#endregion
});