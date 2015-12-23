$(document).ready(function(){
    var isFirstDropDown = [];
    var prevInfiniteTabWidth = [];
    var buttonName = [];

    $( window ).resize(function() {
      createInfiniteTabs();
    });

    // create dropdown
    $(document).find(".infinite-tabs").each(function(infiniteTabIdx, infiniteTab) {
        if (!$(infiniteTab).find("> .dropdown").length) {
            buttonName[infiniteTabIdx] = "More Tabs";

            $(infiniteTab).append(' \
                <li role="presentation" class="dropdown iffyTip"> \
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"> \
                        <span class="selected-name">' +
                        buttonName[infiniteTabIdx] +
                        '</span> <span class="caret"></span><span class="original-dropdown-name">' +
                        buttonName[infiniteTabIdx] +
                    '</span></a> \
                    <ul class="dropdown-menu pull-right"> \
                    </ul> \
                </li>'
            );
        } else {
            buttonName[infiniteTabIdx] = $(infiniteTab).find("> .dropdown .selected-name").text();
            $(infiniteTab).find(".dropdown a").append('<span class="original-dropdown-name">' + buttonName[infiniteTabIdx] + '</span>')
        }    

        $(infiniteTab).find("> li").each(function(idx, tab) {
            if ($(tab).is(":visible")) {
                $(infiniteTab).find("> li .dropdown-menu").append($(tab).context.outerHTML);
            }
        });

        // set max width to dropdown
        $(infiniteTab).find("> .dropdown .selected-name").css("max-width", realWidth($(infiniteTab).find("> .dropdown .selected-name")) + 1);
        $(infiniteTab).find("> .dropdown .selected-name").css("min-width", realWidth($(infiniteTab).find("> .dropdown .selected-name")) + 1);
    });

    function realWidth(obj){
        var clone = obj.clone();

        clone.css("visibility", "hidden");
        $("body").append(clone);

        var width = clone.outerWidth();
        clone.remove();

        return width;
    }

    function createInfiniteTabs() {
        $(document).find(".infinite-tabs").each(function(infiniteTabIdx, infiniteTab) {
            var totalTabsWidth = 0;
            var infiniteTabWidth = $(infiniteTab).width();
            var prevTab, prevTabIdx;

            if (!prevInfiniteTabWidth[infiniteTabIdx] || prevInfiniteTabWidth[infiniteTabIdx] >= $(infiniteTab).width()) {
                $(infiniteTab).find("> li").each(function(tabIdx, tab) {
                    // only do calculation on visible elements
                    if ($(tab).is(":visible")) {
                        var tabWdith = $(tab).width();

                        totalTabsWidth += tabWdith;

                        if (totalTabsWidth >= infiniteTabWidth) {
                            if (!isFirstDropDown[infiniteTabIdx]) {
                                isFirstDropDown[infiniteTabIdx] = true;     

                                $(prevTab).hide();
                                $(tab).hide();

                                // show the dropdown
                                $(infiniteTab).find("> .dropdown").show();

                                // show the dropdown menu items
                                $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(tab).index() + ")").show();
                                $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(prevTab).index() + ")").show();
                            
                                // check if the two tabs are currently selected
                                if ($(tab).hasClass("active")) {
                                    // set selected dropdown-menu to be active
                                    $(infiniteTab).find("> .dropdown").addClass("active");
                                    // change the button name
                                    $(infiniteTab).find("> .dropdown .selected-name").text($(tab).text());
                                
                                    // set active for dropdown item
                                    $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(tab).index() + ")").addClass("active");
                                }

                                if ($(prevTab).hasClass("active")) {
                                    $(infiniteTab).find("> .dropdown").addClass("active");

                                    $(infiniteTab).find("> .dropdown .selected-name").text($(prevTab).text());

                                    $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(prevTab).index() + ")").addClass("active");
                                }
                            } else {
                                $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(prevTab).index() + ")").show();
                                $(prevTab).hide();      

                                if ($(prevTab).hasClass("active")) {
                                    $(infiniteTab).find("> .dropdown").addClass("active");

                                    $(infiniteTab).find("> .dropdown .selected-name").text($(prevTab).text());

                                    $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(prevTab).index() + ")").addClass("active");
                                }                
                            }
                        }

                        prevTab = tab;
                    }
                });
                
            } else {
                var dropdownWidth = $(infiniteTab).find("> .dropdown").width();
                var secondLastTabIdx = $(infiniteTab).find('> li').length - 3;

                // console.log(dropdownWidth);
                $(infiniteTab).find("> li").each(function(tabIdx, tab) {
                    var tabWdith = $(tab).width();

                    totalTabsWidth += tabWdith;                    

                    if (infiniteTabWidth > totalTabsWidth + dropdownWidth) {
                        if (!$(tab).is(":visible")) {
                            if (tabIdx === secondLastTabIdx && infiniteTabWidth > (totalTabsWidth + $(tab).next().width())) {
                                $(infiniteTab).find("> .dropdown").hide();
                                isFirstDropDown[infiniteTabIdx] = false;
                                $(tab).show();                            
                                $(tab).next().show();
                            } else if(tabIdx < secondLastTabIdx) {
                                // check if the new Tab is currently selected in dropdown.
                                if ($(tab).text().trim() === $(infiniteTab).find("> .dropdown .selected-name").text().trim()) {
                                    $(infiniteTab).find("> .dropdown .selected-name").text(buttonName[infiniteTabIdx]);
                                    $(infiniteTab).find("> li").removeClass('active');
                                    $(tab).addClass('active');
                                }

                                $(tab).show();
                                $(infiniteTab).find("> .dropdown .dropdown-menu li:eq(" + $(tab).index() + ")").hide();                            
                            }  
                        }
                    }

                    prevTab = tab;
                });
            }

            prevInfiniteTabWidth[infiniteTabIdx] = $(infiniteTab).width();           
        });   
    }

    createInfiniteTabs();
    createInfiniteTabs();

    $(document).on("click", ".dropdown-menu li a", function(e) {
        $(this).parents(".dropdown").find(".dropdown-toggle .selected-name").html($(this).text());

        $(".iffyTip").tooltip("hide");
    });

    $(document).on('mouseenter', ".iffyTip", function() {
        var $this = $(this);
        var $buttonName = $this.find(".selected-name");

        $this.tooltip({
          title: function(){
            if($buttonName.width() < (realWidth($buttonName))) {
                return $buttonName.text();
            }

            return null;
          }
        });

        $this.tooltip("show");
    });

    $(document).on("click", ".infinite-tabs li", function(e) {
        var $this = $(this);

        if (!$this.hasClass("dropdown")) {
            $this.parent().find("> .dropdown .selected-name").text($this.parent().find(".dropdown .original-dropdown-name").text());
        }
    });
});    