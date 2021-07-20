(function ($) {
    'use strict';

    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if ($(mutation.target).hasClass('work-item-view')) {
                gitBranchAndCommit($(mutation.target));
            }
        });
    });

    observer.observe(document, { subtree: true, attributes: true });

    function gitBranchAndCommit($el) {
        let issueKey = '#' + $el.find('span[aria-label="ID Field"]').text();
        let issueTitle = $el.find('input').val();
        let issueCommit = issueKey + ': ' + issueTitle;

        let issueBranch = issueKey.match(/\d+/) + '-' + issueTitle.trim()
            .replace(/\[.*?][\s"']*/g, '')
            .replace(/\W/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/[-]+$/, '')
            .toLowerCase();

        let content = '<div class="work-item-git-branch-wrapper work-item-control">';
        content += '<strong>Branch: <span class="copy-me" style="color:#d22;cursor:pointer;">' + issueBranch + '</span></strong><br />';
        content += '<strong>Commit: <span class="copy-me" style="color:#d22;cursor:pointer;">' + issueCommit + '</span></strong><br />';
        content += '<strong>Short commit: <span class="copy-me" style="color:#d22;cursor:pointer;">' + issueKey + ': </span></strong>';
        content += '</div>'

        $el
            .find('.work-item-form-title')
            .parent()
            .remove('div.work-item-git-branch-wrapper')
            .append(content);

        $('span.copy-me').off('click').on('click', function () {
            let $this = $(this);

            navigator.clipboard.writeText($this.text()).then(function () {
                $this.fadeOut('slow', function () {
                    $this.fadeIn('slow');
                });

                $.notify($this.text() + ' copied to clipboard', 'success');
            });
        });
    }
})(window.jQuery);
