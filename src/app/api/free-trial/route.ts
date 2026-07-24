import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/free-trial
 * 设备级免费试用：查询或扣减剩余次数
 *
 * Body: { device_id: string, action?: "check" | "consume" }
 * - action=check (默认): 返回剩余次数
 * - action=consume: 扣减 1 次，返回扣减后剩余次数
 *
 * 如果设备不存在，自动创建（默认配额从 operation_config 读）
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const deviceId = String(body.device_id || "").trim();
    const action = body.action === "consume" ? "consume" : "check";

    if (!deviceId || deviceId.length < 4) {
      return NextResponse.json({ error: "device_id 必填且至少 4 位" }, { status: 400 });
    }

    const sb = supabaseAdmin();

    // 1. 读默认配额配置
    const { data: cfg } = await sb
      .from("operation_config")
      .select("value")
      .eq("key", "free_trial.quota")
      .maybeSingle();

    const defaultQuota = (cfg?.value as { default_quota?: number })?.default_quota ?? 10;
    const enabled = (cfg?.value as { enabled?: boolean })?.enabled ?? true;

    if (!enabled) {
      return NextResponse.json({ enabled: false, remaining: 0, total: 0 });
    }

    // 2. 查设备记录
    let { data: trial } = await sb
      .from("device_free_trial")
      .select("*")
      .eq("device_id", deviceId)
      .maybeSingle();

    // 3. 不存在则创建
    if (!trial) {
      const { data: inserted, error: insertErr } = await sb
        .from("device_free_trial")
        .insert({
          device_id: deviceId,
          total_quota: defaultQuota,
          remaining: defaultQuota,
        })
        .select()
        .single();

      if (insertErr) {
        // 可能是并发插入冲突，再查一次
        const { data: retry } = await sb
          .from("device_free_trial")
          .select("*")
          .eq("device_id", deviceId)
          .maybeSingle();
        trial = retry ?? null;
        if (!trial) {
          return NextResponse.json({ error: "创建试用记录失败: " + insertErr.message }, { status: 500 });
        }
      } else {
        trial = inserted;
      }
    }

    // 4. 扣减
    if (action === "consume") {
      if (trial.remaining <= 0) {
        return NextResponse.json({
          success: false,
          remaining: 0,
          total: trial.total_quota,
          message: "免费试用次数已用完，请登录继续使用",
        });
      }

      const { data: updated, error: updateErr } = await sb
        .from("device_free_trial")
        .update({
          remaining: trial.remaining - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("device_id", deviceId)
        .eq("remaining", trial.remaining) // 乐观锁防并发
        .select()
        .single();

      if (updateErr || !updated) {
        // 乐观锁冲突，再查一次返回最新值
        const { data: latest } = await sb
          .from("device_free_trial")
          .select("*")
          .eq("device_id", deviceId)
          .single();
        return NextResponse.json({
          success: false,
          remaining: latest?.remaining ?? 0,
          total: latest?.total_quota ?? defaultQuota,
          message: "扣减失败，请重试",
        });
      }

      return NextResponse.json({
        success: true,
        remaining: updated.remaining,
        total: updated.total_quota,
      });
    }

    // 5. 查询
    return NextResponse.json({
      success: true,
      remaining: trial.remaining,
      total: trial.total_quota,
    });
  } catch (err) {
    console.error("[/api/free-trial] error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
