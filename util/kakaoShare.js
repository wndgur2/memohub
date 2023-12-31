import config from "./config";

export default function initKakao(url) {
    if (!Kakao.isInitialized()) {
        Kakao.init('9972788af7f5094a415d92993bac3517');
    }
    Kakao.Share.createDefaultButton({
        container: '#kakaotalk-sharing-btn',
        objectType: 'feed',
        content: {
            title: `${url}의 메모허브`,
            description: '#니 #맘대로 #아무거나 #적어봐',
            imageUrl:
                'https://loremflickr.com/320/240',
            // `${config.vercel/images/brickWall.png}`
            link: {
                // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                mobileWebUrl: config.vercel,
                webUrl: config.vercel,
            },
        },
        social: {
            likeCount: 999,
            commentCount: 999,
            sharedCount: 999,
        },
        buttons: [
            {
                title: '웹으로 보기',
                link: {
                    mobileWebUrl: `${config.vercel}/hub/${url}`,
                    webUrl: `${config.vercel}/hub/${url}`,
                },
            },
        ],
    });
}

