import { User } from '@/types/User';

export const fetchUser = async (uid: string): Promise<User> => {
    // 入力値の検証
    if (!uid) {
        throw new Error('ユーザーIDが指定されていません');
    }

    try {
        console.log('Fetching user data for uid:', uid); // デバッグログ

        const res = await fetch("/api/portfolio/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid }),
            // エラーハンドリングのための追加オプション
            credentials: 'include',
            cache: 'no-cache'
        });

        // レスポンスステータスのチェック
        if (!res.ok) {
            const errorText = await res.text(); // エラーメッセージを取得
            console.error('API Error Response:', {
                status: res.status,
                statusText: res.statusText,
                errorText
            });
            
            throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const data = await res.json();
        
        // レスポンスデータの検証
        if (!data) {
            throw new Error('ユーザーデータが空です');
        }

        console.log('Received user data:', data); // デバッグログ
        
        return data as User;

    } catch (error) {
        // エラー情報の詳細なログ出力
        console.error('User fetch error details:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('ユーザーデータの取得中に予期せぬエラーが発生しました');
        }
    }
};