/**
 * BzDeck User Profile Page
 * Copyright © 2014 Kohei Yoshino. All rights reserved.
 */

'use strict';

let BzDeck = BzDeck || {};

BzDeck.ProfilePage = function ProfilePage (name) {
  let server = BzDeck.model.data.server,
      $tab = document.querySelector(`#tab-profile-${CSS.escape(name)}`),
      $tabpanel = document.querySelector(`#tabpanel-profile-${CSS.escape(name)}`),
      $profile = $tabpanel.querySelector('article'),
      $status = $tabpanel.querySelector('footer [role="status"]');

  $tabpanel.setAttribute('aria-busy', 'true');
  $status.textContent = 'Loading...'; // l10n

  BzDeck.model.fetch_user(name).then(user => {
    let name = user.real_name || user.name;

    document.title = $tab.title = $tabpanel.querySelector('h2').textContent = `User Profile: ${name}`;

    FlareTail.util.content.fill($profile, {
      'id': user.id,
      'email': user.name,
      'emailLink': 'mailto:' + user.name,
      'name': name,
      'image': 'https://www.gravatar.com/avatar/' + md5(user.name) + '?s=160&d=mm',
    });

    $profile.querySelector('[data-id="bugzilla-profile"] a').href
        = server.url + '/user_profile?login=' + encodeURI(user.name);
    $profile.querySelector('[data-id="bugzilla-activity"] a').href
        = server.url + '/page.cgi?id=user_activity.html&action=run&who=' + encodeURI(user.name);
  }).catch(error => {
    $status.textContent = error.message;
  }).then(() => {
    $tabpanel.removeAttribute('aria-busy');
    $status.textContent = '';
  });
};

BzDeck.ProfilePage.route = '/profile/(.+)';

BzDeck.ProfilePage.connect = function (name) {
  BzDeck.toolbar.open_tab({
    'page_category': 'profile',
    'page_id': name,
    'page_constructor': BzDeck.ProfilePage,
    'page_constructor_args': [name],
    'tab_label': 'Profile', // l10n
    'tab_desc': 'User Profile', // l10n
  });
};