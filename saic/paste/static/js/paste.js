$(document).ready(function (doc) {
    $("input").live("focus", function (e) {
        var $this = $(this);
        if ($this.val() == $this.attr('default')) {
            $this.removeClass('default-input');
            $this.val('');
        }
    }).live("blur", function (e) {
        var $this = $(this);
        if ($this.val() == "") {
            $this.val($this.attr('default'));
            $this.addClass('default-input');
        }
    });

    var languages = {
        '.cc': '.cpp;CppLexer',
        '.cxx': '.cpp;CppLexer',
        '.C': '.cpp;CppLexer',
        '.C': '.c;CLexer',
        '.h': '.c;CLexer',
        '.hpp': '.cpp;CppLexer',
        '.hxx': '.cpp;CppLexer',
        '.java': '.java;JavaLexer'
    };

    var $options = $('div.language:first select > option');

    for (var i = 0; i < $options.length; i++) {
        languages[$options[i].value.split(';')[1]] = $options[i].value;
    }

    $("input").blur();

    $('input.filename').live('keyup', function (e) {
        var $this = $(this);
        var $parent = $this.parents('div.entry');
        var $lang = $('div.language select', $parent);
        var val = $this.val();
        var ext = val.split('.')
        ext = '.' + ext[ext.length - 1];
        var lexer = languages[ext];
        if (lexer) { 
            $lang.val(lexer);
        }
    });


    // HACK(justinvh): I don't want to go modify anymore libraries.
    // This just handles our current theme and makes it work.
    function reorder_deletes() {
        $('li > div.delete-row').each(function () {
            $(this).prev().prev().append(this);
        });
    }

    function update_order() {
        var i = 0;
        $('div.language select').chosen();
        $('div.entry > div.priority > input').each(function () {
            // I am not crazy.
            $(this).attr('value', i);
            i++;
        });
    };


    $('#sortable li').formset({
        'addText': 'add another file to this paste',
        'deleteText': 'delete this file',
        'added': function () {
            $('div.entry:last div.anonymous').remove();
            $('textarea').tabby({'tabString': '    '});
            $('div.entry:last input').val('');
            $('div.entry:last select').val('');
            $('div.entry:last textarea').html('');
            $('input').blur();
            reorder_deletes();
            update_order();
        }
    });

    $('#sortable').sortable({
        'items': 'li',
        'update': function () {
            update_order();
        }
    });
    $('textarea').tabby({'tabString': '    '});
    reorder_deletes();
    update_order();
});
