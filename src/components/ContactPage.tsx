import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ContactPage.css';

const initialContactState = {
    name: '',
    email: '',
    message: '',
};

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState(initialContactState);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💡 お問い合わせ送信処理（現在はダミー処理）
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 必須フィールドの簡易チェック
        if (!formData.name || !formData.email || !formData.message) {
            alert('すべてのフィールドを入力してください。');
            return;
        }

        console.log('送信されたお問い合わせデータ:', formData);
        
        // 💡 サーバー連携後の処理を想定したアラート
        alert('お問い合わせ内容を送信しました。後日、担当者よりご連絡いたします。');
        
        // 送信後はTOPページに戻る
        navigate('/'); 
    };

    return (
        <div className="contact-page-container">
            <div className="contact-content">
                <Link to="/" className="back-to-top-link">
                    &larr; トップページに戻る
                </Link>
                <h1>✉️ お問い合わせ</h1>
                <p>3D図書館の運営に関するご質問、ご意見、ご要望など、お気軽にお寄せください。</p>
                
                <form onSubmit={handleSubmit} className="contact-form">
                    
                    {/* 氏名 */}
                    <div className="form-group">
                        <label htmlFor="name">お名前 (必須)</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    {/* メールアドレス */}
                    <div className="form-group">
                        <label htmlFor="email">メールアドレス (必須)</label>
                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* メッセージ本文 */}
                    <div className="form-group">
                        <label htmlFor="message">メッセージ本文 (必須)</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={8} required />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button">送信する</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;