$().ready(function() {
    //alert(1);
    var items = [];

    RegExp.escape = function(s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };

    $('.portfolio.item').each(function(i, e) {
        var div = e;
        var section = $(e).parent('.section-container');
        var sectionId = section.data('sectionid');
        var sectionName = section.data('sectionname');
        var text = $(e).text();
        var labels = $(e).find('.label2').toArray().map(function(v) { return $(v).data('tag'); });
        items.push({
            div: div,
            labels: labels,
            text: [sectionName, text].join(' ').replace(/\s+/g, ' ').toLowerCase(),
            section: section[0],
            sectionId: sectionId,
            sectionName: sectionName
        });
    });

    //console.log(items);

    var itemsBySection = _.groupBy(items, 'sectionId');
    var sections = _.keys(itemsBySection).map(function(sectionId) {
        var items = itemsBySection[sectionId];
        return {
            id : sectionId,
            div: items[0].section,
            items: items
        };
    });

    function displayFilteredEntries(filter, filterText) {
        var visibleItems = items.filter(filter);
        var invisibleItems = _.difference(items, visibleItems);

        var visibleSections = sections.filter(function(e) {
            return _.intersection(e.items, visibleItems).length > 0;
        });
        var invisibleSections = _.difference(sections, visibleSections);

        visibleSections.forEach(function(e) { $(e.div).show('fast'); });
        invisibleSections.forEach(function(e) { $(e.div).hide('fast'); });

        visibleItems.forEach(function(e) { $(e.div).show('fast'); });
        invisibleItems.forEach(function(e) { $(e.div).hide('fast'); });

        $("html, body").animate({ scrollTop: 0 }, "fast");

        //$(search_results).text('Results: ' + visibleItems.length + ", hiding: " + invisibleItems.length);
        $(search_results).text('Results: ' + visibleItems.length);

        var hasVisibleItems = visibleItems.length > 0;
        var isFiltering = invisibleItems.length != 0;

        $(".hide-on-filtering").toggle(!isFiltering, 'fast');
        $(".show-on-filtering").toggle(isFiltering, 'fast');
        $('.show-on-empty-filtering').toggle(!hasVisibleItems, 'fast');

        $('#search').focus();

        var $entries = $($("#portfolio-entries")[0]);

        $entries.jmRemoveHighlight();
        if (isFiltering) {
          console.log(filterText);
          $entries.jmHighlight(filterText);
        }

        document.location.hash = filterText;
    }

    var searchTimeout = -1;
    var lastSearch = '';
    $('#search').keyup(function(e) {
        var value = $('#search').val().toLowerCase();
        if (value != lastSearch) {
            lastSearch = value;
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                var reg = new RegExp(RegExp.escape(value));
                displayFilteredEntries(function(e) { return e.text.match(reg) != null; }, value);
            }, 150);
        }
    });

    function clearSearch() {
        lastSearch = '';
        $('#search').val('');
    }

    $('.label2').click(function(e) {
        clearSearch();
        var label = $(e.target).data('tag');
        displayFilteredEntries(function(e) {
            return e.labels.indexOf(label) >= 0;
        }, label);
    });

    $('#remove_filtering').click(function(e) {
        clearSearch();
        displayFilteredEntries(function(e) {
            return true;
        }, '');
    });

    var hash = document.location.hash.replace(/^#/, '');
    if (hash != '') {
      $('#search').val(hash).select();
      displayFilteredEntries(function(e) { return e.text.match(hash) != null; }, hash);
    }
});
