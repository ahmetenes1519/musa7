// İçerik moderasyon sistemi - Türkçe küfür, hakaret ve uygunsuz içerik tespiti
import { storage } from './dualStorage';

// Yasaklı kelimeler ve ifadeler
const bannedWords = [
  // Küfür ve hakaret
  'amk', 'amınakodum', 'aq', 'siktir', 'orospu', 'piç', 'kahpe', 'ibne', 'göt', 
  'am', 'sik', 'yarrak', 'taşak', 'amcık', 'fuck', 'shit', 'bitch', 'damn',
  'aptal', 'salak', 'gerizekalı', 'mal', 'ahmak', 'dangalak', 'embesil',
  
  // Din karşıtı ve saygısız ifadeler
  'allah', 'tanrı', 'peygamber', 'din', 'imam', 'hoca', // Bu kelimeler context'e göre değerlendirilecek
  
  // Müstehcen içerik
  'porno', 'seks', 'cinsel', 'nude', 'çıplak', 'mastürbasyon', 'oral',
  
  // Nefret söylemi
  'öldür', 'gebertir', 'katil', 'bomba', 'terör', 'savaş', 'kan', 'ölüm'
];

// İslami değerlere uygun olmayan pattern'ler
const inappropriatePatterns = [
  /\b(allah.*lanet|tanrı.*kötü|din.*saçma)\b/i,
  /\b(peygamber.*yalan|imam.*kötü)\b/i,
  /\b(seks|porno|nude).*ara\b/i,
  /\b(kumar|içki|alkol).*oyna\b/i,
  /\b(öldür|gebertir|katil).*birine\b/i
];

// Agresif dil tespiti
const aggressivePatterns = [
  /\b(seni.*öldür|kelleni.*kopar|canını.*çıkar)\b/i,
  /\b(intikam.*alacağım|hesap.*göreceğin)\b/i,
  /\b(dayak.*atacağım|döveceğim)\b/i
];

export interface ModerationResult {
  isClean: boolean;
  confidence: number;
  reasons: string[];
  bannedWords: string[];
  suggestedAction: 'allow' | 'review' | 'ban' | 'delete';
}

export function moderateContent(text: string): ModerationResult {
  const lowerText = text.toLowerCase();
  const reasons: string[] = [];
  const foundBannedWords: string[] = [];
  let confidence = 0;

  // Yasaklı kelime kontrolü
  for (const word of bannedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      foundBannedWords.push(word);
      confidence += 30;
      
      // Din ile ilgili kelimeler context'e göre değerlendirilir
      if (['allah', 'tanrı', 'peygamber', 'din', 'imam', 'hoca'].includes(word)) {
        // Pozitif ve nötr İslami ifadeler
        const positiveContext = /\b(maşaallah|inşaallah|allahaısmarladık|allah.*rahmet|allah.*korusun|allah.*yardımcısı|elhamdülillah|subhanallah|astağfirullah|bismillah|tanrı.*şükür|peygamber.*sevgi|din.*güzel|imam.*bilgili|hoca.*iyi|dua.*et|allah.*rızası|hayırlı)\b/i;
        const negativeContext = /\b(allah.*lanet|allah.*kötü|tanrı.*yok|din.*saçma|peygamber.*yalan)\b/i;
        
        if (negativeContext.test(text)) {
          reasons.push(`Dini kavramlara saygısızlık: ${word}`);
          confidence += 40;
        } else if (positiveContext.test(text)) {
          // Pozitif dini ifade, puanı düşür
          confidence -= 5;
        }
        // Nötr kullanım için herhangi bir işlem yapma
      } else {
        reasons.push(`Uygunsuz kelime tespit edildi: ${word}`);
      }
    }
  }

  // Pattern kontrolü
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(text)) {
      reasons.push('İslami değerlere aykırı içerik pattern tespit edildi');
      confidence += 40;
    }
  }

  for (const pattern of aggressivePatterns) {
    if (pattern.test(text)) {
      reasons.push('Agresif dil ve tehdit tespit edildi');
      confidence += 50;
    }
  }

  // Büyük harf kullanımı (BAĞIRMA)
  const upperCaseRatio = (text.match(/[A-ZÇĞİÖŞÜ]/g) || []).length / text.length;
  if (upperCaseRatio > 0.6 && text.length > 10) {
    reasons.push('Aşırı büyük harf kullanımı (bağırma)');
    confidence += 10;
  }

  // Tekrarlanan karakterler
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(text)) {
    reasons.push('Aşırı tekrarlanan karakterler (spam)');
    confidence += 15;
  }

  // Sonuç belirleme
  let suggestedAction: 'allow' | 'review' | 'ban' | 'delete' = 'allow';
  
  if (confidence >= 80) {
    suggestedAction = 'ban';
  } else if (confidence >= 50) {
    suggestedAction = 'delete';
  } else if (confidence >= 25) {
    suggestedAction = 'review';
  }

  return {
    isClean: confidence < 25,
    confidence: Math.min(confidence, 100),
    reasons,
    bannedWords: foundBannedWords,
    suggestedAction
  };
}

// Otomatik moderasyon işlemi
export async function autoModerateContent(
  content: string, 
  userId: string, 
  contentType: 'post' | 'comment' | 'dua-request',
  contentId?: string
): Promise<{ allowed: boolean; reason?: string }> {
  
  const moderation = moderateContent(content);
  
  // İçerik temizse izin ver
  if (moderation.isClean) {
    return { allowed: true };
  }

  // Otomatik işlemler
  try {
    if (moderation.suggestedAction === 'ban') {
      // Kullanıcıyı geçici olarak banla
      await storage.banUser({
        user_id: userId,
        reason: `Otomatik moderasyon: ${moderation.reasons.join(', ')}`,
        banned_by: 'system',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat
        ban_type: 'temporary'
      });

      // Admin'e bildirim gönder (şu an console log, daha sonra email/notification sistemi eklenebilir)
      console.log(`🚨 OTOMATIK BAN: Kullanıcı ${userId} banlandı. Sebep: ${moderation.reasons.join(', ')}`);
      
      return { 
        allowed: false, 
        reason: 'İçeriğiniz topluluk kurallarına aykırı bulundu. Hesabınız geçici olarak kısıtlandı.' 
      };
    }

    if (moderation.suggestedAction === 'delete') {
      // İçeriği reddet, admin'e bildir
      console.log(`🚨 İÇERİK REDDEDİLDİ: Kullanıcı ${userId}, İçerik: "${content.substring(0, 50)}..."`);
      console.log(`Sebep: ${moderation.reasons.join(', ')}`);
      
      return { 
        allowed: false, 
        reason: 'İçeriğiniz topluluk kurallarına uygun olmadığı için reddedildi.' 
      };
    }

    if (moderation.suggestedAction === 'review') {
      // İçeriği işaretle, admin incelemesine gönder
      if (contentId) {
        await storage.createReport({
          reported_user_id: userId,
          reporter_id: 'system',
          reason: 'Otomatik moderasyon - İnceleme gerekli',
          description: `Şüpheli içerik tespit edildi: ${moderation.reasons.join(', ')}`,
          ...(contentType === 'post' && { post_id: contentId }),
          ...(contentType === 'dua-request' && { dua_request_id: contentId })
        });
      }

      console.log(`⚠️ İNCELEME GEREKLİ: Kullanıcı ${userId}, İçerik incelemeye alındı`);
      
      // İçeriği yayınla ama işaretle
      return { allowed: true };
    }

  } catch (error) {
    console.error('Moderasyon işlemi sırasında hata:', error);
  }

  return { allowed: true };
}

// Kullanıcı ban durumu kontrolü
export async function checkUserBanStatus(userId: string): Promise<{ isBanned: boolean; reason?: string; expiresAt?: Date }> {
  try {
    const isBanned = await storage.isUserBanned(userId);
    if (isBanned) {
      const bans = await storage.getUserBans(userId);
      const activeBan = bans.find(ban => 
        ban.ban_type === 'permanent' || (ban.expires_at && new Date(ban.expires_at) > new Date())
      );
      
      return {
        isBanned: true,
        reason: activeBan?.reason,
        expiresAt: activeBan?.expires_at || undefined
      };
    }
    
    return { isBanned: false };
  } catch (error) {
    console.error('Ban durumu kontrolü sırasında hata:', error);
    return { isBanned: false };
  }
}