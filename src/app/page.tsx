"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ApiTester />
    </Suspense>
  );
}

function ApiTester() {
  const [url, setUrl] = useQueryState("url", {
    defaultValue: "https://7107.api.greenapi.com",
  });
  const [idInstance, setIdInstance] = useQueryState("idInstance", {
    defaultValue: "",
  });
  const [apiToken, setApiToken] = useQueryState("apiToken", {
    defaultValue: "",
  });

  const [msgPhone, setMsgPhone] = useState("");
  const [msgText, setMsgText] = useState("");

  const [filePhone, setFilePhone] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [response, setResponse] = useState<string>("");
  const [statusCode, setStatusCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const setResp = async (r: Response) => {
    const text = await r.text();
    const data = text ? JSON.parse(text) : null;

    setResponse(data !== null ? JSON.stringify(data, null, 2) : "");
    setStatusCode(r.status + " " + r.statusText);
    setStatus(r.ok ? "success" : "error");
  };

  const setErr = (err: unknown) => {
    setResponse(JSON.stringify({ error: String(err) }, null, 2));
    setStatus("error");
  };

  const base = `${url}/waInstance${idInstance}`;

  async function handleGetSettings() {
    setLoading("settings");
    try {
      const r = await fetch(`${base}/getSettings/${apiToken}`);
      await setResp(r);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(null);
    }
  }

  async function handleGetState() {
    setLoading("state");
    try {
      const r = await fetch(`${base}/getStateInstance/${apiToken}`);
      setResp(r);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(null);
    }
  }

  async function handleSendMessage() {
    setLoading("message");
    try {
      const r = await fetch(`${base}/sendMessage/${apiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: `${msgPhone}@c.us`,
          message: msgText,
        }),
      });
      setResp(r);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(null);
    }
  }

  async function handleSendFile() {
    setLoading("file");
    try {
      const r = await fetch(`${base}/sendFileByUrl/${apiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: `${filePhone}@c.us`,
          urlFile: fileUrl,
          fileName: new URL(fileUrl).pathname.split("/").pop() || "file",
        }),
      });
      setResp(r);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-[420px_1fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="border rounded-lg p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="url">url</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://7107.api.greenapi.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="idInstance">idInstance</Label>
                  <Input
                    id="idInstance"
                    value={idInstance}
                    onChange={(e) =>
                      setIdInstance(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="1234567890"
                    inputMode="numeric"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="apiToken">apiTokenInstance</Label>
                  <Input
                    id="apiToken"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="your-api-token"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-5 space-y-3">
                <Button
                  onClick={handleGetSettings}
                  disabled={!!loading || !idInstance || !apiToken}
                  className="w-full"
                >
                  {loading === "settings" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  )}
                  getSettings
                </Button>

                <Button
                  onClick={handleGetState}
                  disabled={!!loading || !idInstance || !apiToken}
                  className="w-full"
                >
                  {loading === "state" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  )}
                  getStateInstance
                </Button>
              </div>

              <div className="border rounded-lg p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="msgPhone">Phone Number</Label>
                  <Input
                    id="msgPhone"
                    value={msgPhone}
                    onChange={(e) =>
                      setMsgPhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="77771234567"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="msgText">Message</Label>
                  <Textarea
                    id="msgText"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Hello World!"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !!loading ||
                    !msgPhone ||
                    !msgText ||
                    !idInstance ||
                    !apiToken
                  }
                  className="w-full"
                  variant="default"
                >
                  {loading === "message" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  )}
                  sendMessage
                </Button>
              </div>

              <div className="border rounded-lg p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="filePhone">Phone Number</Label>
                  <Input
                    id="filePhone"
                    value={filePhone}
                    onChange={(e) =>
                      setFilePhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="77771234567"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fileUrl">File URL</Label>
                  <Input
                    id="fileUrl"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://my.site.com/img/horse.png"
                  />
                </div>

                <Button
                  onClick={handleSendFile}
                  disabled={
                    !!loading ||
                    !filePhone ||
                    !fileUrl ||
                    !idInstance ||
                    !apiToken
                  }
                  className="w-full"
                >
                  {loading === "file" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  )}
                  sendFileByUrl
                </Button>
              </div>
            </div>
            <div className="sticky top-8">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/40">
                  <div className="flex gap-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Response
                    </p>
                    {statusCode !== null && (
                      <span
                        className={cn(
                          "text-xs font-mono px-1.5 py-0.5 rounded font-medium",
                          statusCode.startsWith("2")
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {statusCode}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {loading && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Fetching...
                      </span>
                    )}
                    {response && !loading && (
                      <button
                        onClick={() => {
                          setResponse("");
                          setStatus("idle");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-160px)]">
                  <pre
                    className={cn(
                      "p-5 text-xs leading-relaxed font-mono whitespace-pre-wrap break-all min-h-50",
                      status === "success" && "text-foreground",
                      status === "error" && "text-destructive",
                      status === "idle" && "text-muted-foreground",
                    )}
                  >
                    {response
                      ? response
                      : statusCode
                        ? "Пустой ответ"
                        : `// Ответ появится здесь\n// Введите данные и нажмите на метод`}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
