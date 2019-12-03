(function($) {

    $.fn.uColorPicker = function(options) {
        var o=$.extend({}, {
              color: "",
              onColorChanged: null,
          }, options),

          // functions to convert rgb color to hex format
          hexDigits = "0123456789abcdef",
          hex = function(x) {
            return isNaN(x) ? "00" : hexDigits.charAt((x - x % 16) / 16) + hexDigits.charAt(x % 16);
          },
          rgb2hex = function(rgb) {
            var rgba = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return rgba ? "#" + hex(rgba[1]) + hex(rgba[2]) + hex(rgba[3]) : rgb;
          };

        return this.each(function() {
            var $picker = $(this),
                $palette = $picker.find(".color-palette"),
                initToken = "init-click",

                setColor = function(color, selectedElement, onChanged) {
                  color = rgb2hex(color);
                  color = color.charAt(0) == "#" ? color : "";

                  if (!selectedElement) // case-insensitive search. And selector 'div[data-color="'++color'" i]' doesn't works. Don't try it again, don't waste time. Use filter().
                    selectedElement = color ? $palette.find("div[data-color]").filter(function(){ return $(this).attr("data-color").toLowerCase().indexOf(color) > -1; }) : $palette.find(".transparent-color");

                  $palette.find("div.palette-selected-color").removeClass("palette-selected-color");
                  $(selectedElement).addClass("palette-selected-color");

                  $picker.find(".selected-color").css("background-color", color);
                  $picker.find('input[type="hidden"]').val(color);

                  if (onChanged)
                    onChanged(color);
                };

            setColor(o.color ? o.color : "transparent");

            if (!$picker.data(initToken)) { // avoid double initialization
              $picker.data(initToken, 1);

              $picker.find(".color-palette div").each(function() {
                var $colorCell = $(this);
                $colorCell.css("background-color", $colorCell.attr("data-color"));
                $colorCell.click(function() {
                  setColor($colorCell.css("background-color"), $colorCell, o.onColorChanged);

                  // kludge to hide the color panel after click
                  $palette.css("display", "none");
                  $(document).on("mousemove mousedown", function(){
                    $palette.css("display", "");
                    $(document).off("mousemove");
                  });
                });
              });
            }
          });
    };
})(jQuery);