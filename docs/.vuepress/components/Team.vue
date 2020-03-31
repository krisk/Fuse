<template>
  <ul id="team-members">
    <li class="profile-container" v-for="profile in team">
      <div class="avatar">
        <img
          v-if="profile.social.github"
          :src="`https://github.com/${profile.social.github}.png`"
          :alt="profile.name"
          width="80"
          height="80"
        />
      </div>
      <div class="profile">
        <h3 :data-official-title="profile.title">
          {{ profile.name }}
          <!-- <sup v-if="profile.title" v-html="profile.title"></sup> -->
        </h3>
        <dl>
          <template v-if="profile.work">
            <dt>
              <i class="fa fa-briefcase"></i>
              <span class="sr-only">Work</span>
            </dt>
            <dd v-html="workHtml(profile)"></dd>
          </template>
          <template v-if="profile.city">
            <dt>
              <i class="fa fa-map-marker"></i>
              <span class="sr-only">City</span>
            </dt>
            <dd>
              {{ profile.city }}
            </dd>
          </template>
          <template v-if="profile.languages">
            <dt>
              <i class="fa fa-globe"></i>
              <span class="sr-only">Languages</span>
            </dt>
            <dd v-html="languageListHtml(profile)" class="language-list"></dd>
          </template>
          <template v-if="profile.links">
            <dt>
              <i class="fa fa-link"></i>
              <span class="sr-only">Links</span>
            </dt>
            <dd>
              <ul>
                <li v-for="link in profile.links">
                  <a :href="link" target="_blank">{{ minimizeLink(link) }}</a>
                </li>
              </ul>
            </dd>
          </template>
          <footer class="social">
            <a
              class="github"
              v-if="profile.social.github"
              :href="githubUrl(profile.social.github)"
            >
              <i class="fab fa-github"></i>
              <span class="sr-only">Github</span>
            </a>
            <a
              class="twitter"
              v-if="profile.social.twitter"
              :href="`https://twitter.com/${profile.social.twitter}`"
            >
              <i class="fab fa-twitter"></i>
              <span class="sr-only">Twitter</span>
            </a>
            <a
              class="linkedin"
              v-if="profile.social.linkedin"
              :href="`https://linkedin.com/in/${profile.social.linkedin}`"
            >
              <i class="fab fa-linkedin"></i>
              <span class="sr-only">LinkedIn</span>
            </a>
            <a
              class="reddit"
              v-if="profile.social.reddit"
              :href="`https://www.reddit.com/user/${profile.social.reddit}`"
            >
              <i class="fab fa-reddit"></i>
              <span class="sr-only">Reddit</span>
            </a>
          </footer>
        </dl>
      </div>
    </li>
  </ul>
</template>

<script>
/* global globalThis */

let team = [
  {
    name: 'Kiro Risk',
    // title: 'Benevolent Dictator For Life',
    city: 'San Francisco, CA, USA',
    social: {
      github: 'krisk',
      twitter: 'kirorisk',
      linkedin: 'kirollos',
      reddit: 'kirorisk'
    },
    languages: ['en', 'it', 'fr'],
    work: {
      role: 'Creator',
      org: 'Fuse.js'
    },
    links: [
      'https://github.com/sponsors/krisk',
      'https://www.patreon.com/krisk'
    ]
  }
]

const languageNameFor = {
  en: 'English',
  zh: '中文',
  vi: 'Tiếng Việt',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  jp: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  el: 'Ελληνικά',
  es: 'Español',
  hi: 'हिंदी',
  fa: 'فارسی',
  ko: '한국어',
  ro: 'Română'
}

export default {
  name: 'Team',
  data: () => ({
    team
  }),
  methods: {
    workHtml(profile) {
      var work = profile.work
      var html = ''
      if (work.orgUrl) {
        html += `<a href="${work.orgUrl}" target="_blank">`
        if (work.org) {
          html += work.org
        } else {
          this.minimizeLink(work.orgUrl)
        }
        html += '</a>'
      } else if (work.org) {
        html += work.org
      }
      if (work.role) {
        if (html.length > 0) {
          html = `${work.role} @ ${html}`
        } else {
          html = work.role
        }
      }
      return html
    },
    /**
     * Generate a GitHub URL using a repo and a handle.
     */
    githubUrl(handle, repo) {
      if (repo && repo.url) {
        return repo.url
      }
      if (repo && repo.indexOf('/') !== -1) {
        // If the repo name has a slash, it must be an organization repo.
        // In such a case, we discard the (personal) handle.
        return `https://github.com/${repo.replace(/\/\*$/, '')}`
      }
      return `https://github.com/${handle}/${repo || ''}`
    },
    languageListHtml(profile) {
      if (!profile.languages) return ''

      let nav = globalThis.navigator

      let preferredLanguageCode = nav
        ? nav.languages
          ? // The preferred language set in the browser
            nav.languages[0]
          : // The system language in IE
            nav.userLanguage ||
            // The language in the current page
            nav.language
        : null

      return (
        '<ul><li>' +
        profile.languages
          .map((languageCode, index) => {
            const language = languageNameFor[languageCode]
            if (
              languageCode !== 'en' &&
              preferredLanguageCode &&
              languageCode === preferredLanguageCode.slice(0, 2)
            ) {
              const title = `${profile.name} can give technical talks in your preferred language.`
              return `<span class="user-match" title="${title}">${language}</span>`
            }
            return language
          })
          .join('</li><li>') +
        '</li></ul>'
      )
    },
    minimizeLink(link) {
      return link
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/\/$/, '')
        .replace(/^mailto:/, '')
    }
  }
}
</script>

<style lang="css">
#team-members .sort-by-distance-button {
  display: inline-block;
  padding: 0.4em 0.7em 0.45em;
  font-weight: bold;
  font-size: 0.5em;
  text-transform: uppercase;
  line-height: 1;
  border: none;
  background: #304455;
  color: #fff;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  float: right;
  margin-top: 0.3em;
}
#team-members .sort-by-distance-button i {
  margin-right: 0.25em;
}
#team-members .sort-by-distance-button i:last-child {
  margin-right: 0;
}
#team-members .sort-by-distance-button[disabled] {
  opacity: 0.7;
  cursor: default;
}
#team-members .profile-container {
  display: flex;
  padding: 25px 0;
  border-bottom: 1px dotted #ddd;
}
#team-members .profile-container:first-of-type {
  margin-top: 15px;
}
#team-members .profile-container:last-of-type {
  border-bottom: none;
}
#team-members .profile-container .avatar {
  flex: 0 0 80px;
}
#team-members .profile-container .avatar img {
  border-radius: 50%;
  object-fit: cover;
}
#team-members .profile-container .profile {
  padding-left: 26px;
  flex: 1;
}
#team-members .profile-container .profile h3 {
  margin: 0;
  font-size: 1.3em;
}
#team-members .profile-container .profile h3::before,
#team-members .profile-container .profile h3::after {
  display: none;
}
#team-members .profile-container .profile h3 > sup {
  text-transform: uppercase;
  font-size: 0.7em;
  letter-spacing: 0.3px;
  padding: 2px 5px;
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.6);
  background: #f9f7f5;
  border-radius: 5px;
}
#team-members .profile-container .profile .user-match {
  cursor: help;
  color: #4682b4;
}
#team-members .profile-container .profile .user-match:after {
  content: '\f06a';
  font-family: 'Font Awesome 5 Free';
  font-size: 0.75em;
  vertical-align: super;
  margin-left: 4px;
  margin-right: 2px;
  position: relative;
}
#team-members .profile-container .profile dl {
  margin: 0.6em 0 0;
}
#team-members .profile-container .profile dt,
#team-members .profile-container .profile dd,
#team-members .profile-container .profile ul,
#team-members .profile-container .profile li {
  display: inline;
  padding: 0;
  margin: 0;
  line-height: 1.3;
}
#team-members .profile-container .profile dt {
  text-transform: uppercase;
  font-size: 0.84em;
  font-weight: 600;
}
#team-members .profile-container .profile dt::after {
  content: '';
  margin-right: 7px;
}
#team-members .profile-container .profile dt i {
  width: 14px;
  text-align: center;
}
#team-members .profile-container .profile dt i.fa-map-marker {
  font-size: 1.15em;
}
#team-members .profile-container .profile dt i.fa-globe {
  font-size: 1.2em;
}
#team-members .profile-container .profile dt i.fa-link {
  font-size: 1.05em;
}
#team-members .profile-container .profile dd {
  font-weight: 600;
}
#team-members .profile-container .profile dd::after {
  display: block;
  content: ' ';
  margin-top: 0.6em;
}
#team-members .profile-container .profile li {
  display: inline-block;
}
#team-members .profile-container .profile li::after {
  display: inline-block;
  content: '·';
  margin: 0 8px;
}
#team-members .profile-container .profile li:last-child::after {
  content: '';
}
#team-members .profile-container .profile .social a {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  margin-right: 4px;
}
#team-members .profile-container .profile .social a.github,
#team-members .profile-container .profile .social a.codepen {
  color: #000;
}
#team-members .profile-container .profile .social a.twitter {
  color: #1da1f3;
}
#team-members .profile-container .profile .social a.linkedin {
  color: #0077b5;
}
#team-members .profile-container .profile .social a.reddit {
  color: #ff4501;
}
#team-members .profile-container .profile .social i {
  vertical-align: text-bottom;
  font-size: 1.3em;
}
@media (max-width: 640px) {
  #team-members .profile-container .profile h3 sup {
    display: inline-block;
    margin-left: 0;
  }
}
</style>
