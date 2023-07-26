"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostValidator, type PostCreationRequest } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useLoginToast } from "@/hooks/use-login-toast";

interface EditorProps {
  subredditId: string;
}

const Editor: React.FC<EditorProps> = ({ subredditId }) => {
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
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        subredditId,
        title,
        content,
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
  // TODO: extract the hook into a separate custom hook use-component-mounted
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

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
                  const [res] = await uploadFiles([file], "imageUploader");

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
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
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
      </form>
    </div>
  );
};

export default Editor;
