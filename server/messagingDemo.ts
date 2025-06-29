// İslami sosyal platform mesajlaşma demo sistemi
import { storage } from "./supabaseStorage";
import type { InsertUser, InsertPost, InsertDuaRequest, InsertComment } from "@shared/schema";

export async function createDemoMessaging() {
  try {
    console.log("🕌 İslami sosyal platform demo mesajları oluşturuluyor...");

    // Demo kullanıcıları oluştur
    const users = [
      {
        email: "ahmed@islamic-platform.com",
        name: "Ahmed Öztürk",
        username: "ahmed_oz",
        bio: "Allahu Teala'nın rızasını kazanmaya çalışan bir mümin.",
        verified: false,
        role: "user" as const
      },
      {
        email: "fatma@islamic-platform.com", 
        name: "Fatma Demir",
        username: "fatma_hanım",
        bio: "Kur'an ve Sünnet rehberliğinde yaşamaya çalışıyorum.",
        verified: true,
        role: "user" as const
      },
      {
        email: "mehmet@islamic-platform.com",
        name: "Mehmet Kaya",
        username: "mehmet_hoca",
        bio: "İlim tahsil eden ve öğreten bir kardeşiniz.",
        verified: true,
        role: "moderator" as const
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      try {
        const user = await storage.createUser(userData);
        createdUsers.push(user);
        console.log(`✅ Kullanıcı oluşturuldu: ${user.name}`);
      } catch (error) {
        console.log(`⚠️ Kullanıcı zaten mevcut: ${userData.name}`);
      }
    }

    if (createdUsers.length === 0) {
      console.log("📝 Demo mesajları için mevcut kullanıcılar kullanılacak");
      return { success: true, message: "Demo veriler zaten mevcut" };
    }

    // Demo gönderileri oluştur
    const posts = [
      {
        user_id: createdUsers[0].id,
        content: "Selam aleykum kardeşlerim! Yeni İslami sosyal platformumuza hoş geldiniz. Rabbimiz bereketli etsin. 🤲",
        type: "text" as const,
        category: "Selamlaşma",
        tags: ["selam", "hoşgeldiniz", "bereket"]
      },
      {
        user_id: createdUsers[1].id,
        content: "Aleykümü's-selam ve rahmetullahi ve berekatuh! Bu platformda güzel paylaşımlar göreceğimizi umuyorum. 🌙",
        type: "text" as const,
        category: "Selamlaşma", 
        tags: ["aleykümselam", "ümit", "paylaşım"]
      },
      {
        user_id: createdUsers[2].id,
        content: "Bugün Cuma namazını cemaatle kıldık. Hutbede sabır konusu işlendi. Çok faydalıydı, elhamdulillah. 🕌",
        type: "text" as const,
        category: "İbadet",
        tags: ["cuma", "cemaat", "hutbe", "sabır"]
      }
    ];

    const createdPosts = [];
    for (const postData of posts) {
      const post = await storage.createPost(postData);
      createdPosts.push(post);
      console.log(`✅ Gönderi oluşturuldu: ${post.content.substring(0, 50)}...`);
    }

    // Demo dua talepleri oluştur
    const duaRequests = [
      {
        user_id: createdUsers[0].id,
        title: "Ailesi İçin Dua Talebi",
        content: "Kardeşlerim, annemin sağlığı için dualarınızı rica ediyorum. Allah şifa versin inşallah.",
        category: "Sağlık",
        is_urgent: false,
        is_anonymous: false,
        tags: ["aile", "sağlık", "şifa", "anne"]
      },
      {
        user_id: createdUsers[1].id, 
        title: "İmtihan İçin Dua",
        content: "Yaklaşan sınavlarım için hayırlı olması adına dualarınızı bekliyorum. Barakallahu feekum.",
        category: "Eğitim",
        is_urgent: true,
        is_anonymous: false,
        tags: ["sınav", "eğitim", "hayır", "başarı"]
      }
    ];

    const createdDuas = [];
    for (const duaData of duaRequests) {
      const dua = await storage.createDuaRequest(duaData);
      createdDuas.push(dua);
      console.log(`✅ Dua talebi oluşturuldu: ${dua.title}`);
    }

    // Demo yorumları oluştur
    const comments = [
      {
        user_id: createdUsers[1].id,
        post_id: createdPosts[0].id,
        content: "Aleykümü's-selam kardeşim! Platforma hoş geldin sen de. 💚",
        is_prayer: false
      },
      {
        user_id: createdUsers[2].id,
        dua_request_id: createdDuas[0].id,
        content: "Allah'tan annenize şifa diliyorum. Rabbim sabır versin size. 🤲",
        is_prayer: true
      },
      {
        user_id: createdUsers[0].id,
        dua_request_id: createdDuas[1].id,
        content: "Sınavların hayırlı geçmesi için dua ediyorum. Allah kolaylık versin. 📚",
        is_prayer: true
      }
    ];

    const createdComments = [];
    for (const commentData of comments) {
      const comment = await storage.createComment(commentData);
      createdComments.push(comment);
      console.log(`✅ Yorum eklendi: ${comment.content.substring(0, 30)}...`);
    }

    console.log("🎉 İslami sosyal platform demo mesajları başarıyla oluşturuldu!");
    
    return {
      success: true,
      message: "Demo mesajlaşma sistemi aktif",
      stats: {
        users: createdUsers.length,
        posts: createdPosts.length,
        duaRequests: createdDuas.length,
        comments: createdComments.length
      }
    };

  } catch (error) {
    console.error("❌ Demo mesaj oluşturma hatası:", error);
    throw error;
  }
}

export async function verifyMessaging() {
  try {
    console.log("🔍 Mesajlaşma sistemi doğrulanıyor...");
    
    const posts = await storage.getPosts(10);
    const duaRequests = await storage.getDuaRequests(10);
    
    console.log(`📊 Sistem durumu:`);
    console.log(`   - Toplam gönderi: ${posts.length}`);
    console.log(`   - Toplam dua talebi: ${duaRequests.length}`);
    
    if (posts.length > 0) {
      console.log(`   - Son gönderi: "${posts[0].content.substring(0, 50)}..."`);
    }
    
    if (duaRequests.length > 0) {
      console.log(`   - Son dua talebi: "${duaRequests[0].title}"`);
    }
    
    console.log("✅ Mesajlaşma sistemi çalışıyor ve veriler Supabase'de saklanıyor!");
    
    return {
      success: true,
      message: "Supabase mesajlaşma sistemi doğrulandı",
      data: {
        totalPosts: posts.length,
        totalDuaRequests: duaRequests.length,
        lastPost: posts[0]?.content?.substring(0, 100) || "Henüz gönderi yok",
        lastDua: duaRequests[0]?.title || "Henüz dua talebi yok"
      }
    };
    
  } catch (error) {
    console.error("❌ Mesajlaşma doğrulama hatası:", error);
    throw error;
  }
}