import { nl2br } from './helpers';

class Tweet {

    constructor (tweet, $template, filterHash, screenName) {

        this.months = {
            long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };

        this.tweet = tweet;
        this.text = tweet.text;

        this.screenName = screenName;

        this.filterHash = filterHash || null;

        this.$template = $template.cloneNode(true);
        this.$tweet;

        this.createTweetNode();

        return this.$tweet;

    }

    createTweetNode () {

        this.$tweet = this.$template.cloneNode(true);
        this.$tweet.id = this.tweet.id_str;

        this.insertTime()
            .insertText()
            .insertTweetLink();

    }

    insertTime () {

        var fullDate = this.createFullDate(this.tweet.created_at);
        var humanDate = this.createHumanDate(this.tweet.created_at);

        this.$tweet.querySelectorAll('.tweet-time')[0].innerHTML = humanDate;
        this.$tweet.querySelectorAll('.tweet-time')[0].setAttribute('datetime', fullDate);
        this.$tweet.querySelectorAll('.tweet-time')[0].title = fullDate;

        return this;

    };

    insertText () {

        this.insertHyperlinks();

        this.$tweet.querySelectorAll('.tweet-body')[0].innerHTML = nl2br(this.text);

        return this;

    };

    insertTweetLink () {

        this.$tweet.querySelectorAll('.tweet-link')[0].href = "https://twitter.com/" + this.screenName + "/status/" + this.tweet.id_str;

        return this;

    };

    insertHyperlinks () {

        this.stripFilterHash()
            .linkUrls()
            .linkMentions()
            .linkMedia()
            .linkHashTags();

        return this;

    };

    stripFilterHash () {

        if (this.filterHash) {
            this.text = this.text.replace(this.filterHash, '');
        }

        return this;

    };

    linkHashTags () {

        var hashtags = this.tweet.entities.hashtags;
        var x = hashtags.length;
        while (x--) {
            this.text = this.text.replace('#' + hashtags[x].text, '<a target="_blank" href="https://twitter.com/hashtag/'+ hashtags[x].text +'">#'+ hashtags[x].text +'</a>');
        }

        return this;

    };

    linkMentions () {

        var mentions = this.tweet.entities.user_mentions;
        var x = mentions.length;
        while (x--) {
            this.text = this.text.replace('@' + mentions[x].screen_name, '<a title="'+ mentions[x].name +'" target="_blank" href="https://twitter.com/'+ mentions[x].screen_name +'">@'+ mentions[x].screen_name +'</a>');
        }

        return this;

    };

    linkMedia () {

        var media = this.tweet.entities.media;
        if (!media) return this;
        var x = media.length;
        while (x--) {
            this.text = this.text.replace(media[x].url, '<a target="_blank" href="'+ media[x].url +'">'+ media[x].url +'</a>');
        }

        return this;

    };

    linkUrls (text) {

        var urls = this.tweet.entities.urls;
        var x = urls.length;
        while (x--) {
            this.text = this.text.replace(urls[x].url, '<a title="'+ urls[x].expanded_url +'" target="_blank" href="'+ urls[x].expanded_url +'">'+ urls[x].url +'</a>');
        }

        return this;

    };

    createHumanDate () {

        var date = new Date(this.tweet.created_at);
        var month = this.months.short[date.getMonth()]
        var day = date.getDate();

        if (day < 10) day = '0' + day;

        day += this.getDaySuffix(day);

        return [day, month].join(' ');

    };

    createFullDate () {

        return new Date(this.tweet.created_at);;

    };

    getDaySuffix (day) {

        var suffix = 'th';

        switch (day) {
            case '01':
            case '21':
            case '31':
                suffix = 'st';
                break;
            case '02':
            case '22':
                suffix = 'nd';
                break;
            case '03':
            case '23':
                suffix = 'rd';
                break;
            default:
                break;
        }

        return suffix;

    };


}

module.exports = Tweet;
