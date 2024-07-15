import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setLoading(true);
        try {
            let file = null;
            if (data.image && data.image[0]) {
                file = await appwriteService.uploadFile(data.image[0]);
            }

            if (post) {
                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                const updatedPost = await appwriteService.updatPost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage,
                });

                if (updatedPost) {
                    navigate(`/post/${updatedPost.$id}`);
                }
            } else {
                if (file) {
                    data.featuredImage = file.$id;
                }
                const newPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (newPost) {
                    navigate(`/post/${newPost.$id}`);
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
                <Controller
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                    render={({ field: { onChange, value } }) => (
                        <RTE
                            label="Content :"
                            name="content"
                            control={control}
                            defaultValue={value}
                            onChange={onChange}
                        />
                    )}
                />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: "Status is required" })}
                />
                {errors.status && <p className="text-red-500">{errors.status.message}</p>}
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}













