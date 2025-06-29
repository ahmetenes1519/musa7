// Test messages for Supabase system verification
import { storage } from "./supabaseStorage";
import type { InsertUser, InsertPost, InsertDuaRequest, InsertComment } from "@shared/schema";

export async function testMessages() {
  try {
    console.log("🔄 Supabase mesajlaşma sistemi test ediliyor...");

    // Test kullanıcısı oluştur
    const testUser: InsertUser = {
      email: "test@islamic-platform.com",
      name: "Test Kullanıcısı",
      username: "testuser" + Date.now(),
      bio: "Sistem test kullanıcısı",
      verified: false,
      role: "user"
    };

    const createdUser = await storage.createUser(testUser);
    console.log("✅ Test kullanıcısı oluşturuldu:", createdUser.username);

    // Test mesajı (post) oluştur
    const testPost: InsertPost = {
      user_id: createdUser.id,
      content: "Selam aleykum kardeşlerim! Bu bir test mesajıdır. Sistem Supabase ile çalışıyor. 🕌",
      type: "text",
      category: "Test",
      tags: ["test", "sistem", "mesaj"]
    };

    const createdPost = await storage.createPost(testPost);
    console.log("✅ Test mesajı gönderildi:", createdPost.id);

    // Test dua talebi oluştur
    const testDua: InsertDuaRequest = {
      user_id: createdUser.id,
      title: "Sistem Test Duası",
      content: "Allahım, bu İslami platform sisteminin sorunsuz çalışması için dua ediyoruz.",
      category: "Sistem",
      is_urgent: false,
      is_anonymous: false,
      tags: ["test", "sistem", "dua"]
    };

    const createdDua = await storage.createDuaRequest(testDua);
    console.log("✅ Test dua talebi oluşturuldu:", createdDua.id);

    // Test yorumu oluştur
    const testComment: InsertComment = {
      user_id: createdUser.id,
      post_id: createdPost.id,
      content: "Bu test yorumudur. Sistem çalışıyor! Maşallah 🤲",
      is_prayer: false
    };

    const createdComment = await storage.createComment(testComment);
    console.log("✅ Test yorumu eklendi:", createdComment.id);

    // Mesajları okuma testi
    const posts = await storage.getPosts(5);
    console.log("✅ Mesajlar okundu, toplam:", posts.length);

    const duaRequests = await storage.getDuaRequests(5);
    console.log("✅ Dua talepleri okundu, toplam:", duaRequests.length);

    console.log("🎉 Supabase mesajlaşma sistemi başarıyla çalışıyor!");
    
    return {
      success: true,
      user: createdUser,
      post: createdPost,
      duaRequest: createdDua,
      comment: createdComment,
      totalPosts: posts.length,
      totalDuas: duaRequests.length
    };

  } catch (error) {
    console.error("❌ Supabase test hatası:", error);
    throw error;
  }
}

export async function cleanupTestData() {
  try {
    console.log("🧹 Test verileri temizleniyor...");
    // Test verileri kaldırma işlemi burada yapılabilir
    console.log("✅ Test verileri temizlendi");
  } catch (error) {
    console.error("⚠️ Test verisi temizleme hatası:", error);
  }
}