"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLoginToast } from "@/hooks/use-login-toast";
import { useIsComponentMounted } from "@/hooks/use-is-component-mounted";
import { usePathname, useRouter } from "next/navigation";

import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostValidator, type PostCreationRequest } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { type Flair } from "@prisma/client";

interface EditorProps {
  subredditId: string;
  flairs: Flair[];
}

const Editor: React.FC<EditorProps> = ({
  subredditId,
  flairs,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });
  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
      flairId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        subredditId,
        title,
        content,
        flairId,
      };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // if user are not subscribed on subreddit
        if (error.response?.status === 403) {
          return toast({
            title: "You need to subscribe",
            description:
              "You need to subscribe to the subreddit to post something.",
            variant: "destructive",
          });
        }

        // if user are unauthorized
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const { loginToast } = useLoginToast();
  const ref = React.useRef<EditorJS>();
  const _titleRef = React.useRef<HTMLTextAreaElement>(null);
  const { ref: titleRef, ...rest } = register("title");
  const { isMounted } = useIsComponentMounted();
  const [selectedFlair, setSelectedFlair] = React.useState<string | null>(null);

  React.useEffect(() => {
    const init = async () => {
      await initEditor();
    };

    // setTimeout for moving to the end of callstack
    setTimeout(() => {
      _titleRef.current?.focus();
    }, 0);

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy(); // destroy editor-js
        ref.current = undefined;
      };
    }
  }, [isMounted]);

  React.useEffect(() => {
    // if we have any errors from react-hook-form
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([_key, value]) => {
        const { message } = value as { message: string };
        toast({
          title: "Something went wrong",
          description: message,
          variant: "destructive",
        });
      });
    }
  }, [errors]);

  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
      flairId: selectedFlair,
    };

    createPost(payload);
  };

  const initEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/editor-link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    endpoint: "imageUploader",
                    files: [file],
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  return (
    <div className="w-full p-4 bg-zinc-50 dark:bg-slate-900 rounded-lg border border-zinc-200 dark:border-zinc-500">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
              title="Title"
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />

            <div id="editor" className="min-h-[500px]"></div>
          </div>
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
        <div className="my-2">
          <p className="py-2 text-gray-300">
            Select an appropriate flair for this post
          </p>
          <div className="flex gap-x-2 gap-y-3">
            {!!flairs.length &&
              flairs.map((flair) => (
                <div
                  className="group w-fit flex justify-between items-center"
                  key={flair.id}
                  onClick={() => setSelectedFlair(flair.id)}
                >
                  <div
                    className="rounded-[20px] text-zinc-100 cursor-pointer py-2 px-3"
                    style={{ backgroundColor: flair.color }}
                  >
                    {flair.name}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;
