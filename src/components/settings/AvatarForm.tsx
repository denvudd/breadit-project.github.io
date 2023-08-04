"use client";

import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/Card";

interface AvatarFormProps {}

const AvatarForm: React.FC<AvatarFormProps> = () => {
  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Images must be .png or .jpg format.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Avatar
            </Label>
            <div className="w-80">
              <UploadDropzone
                endpoint="avatarUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const json = JSON.stringify(res);
                    // Do something with the response
                    console.log(json);
                  }
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            {/* {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )} */}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={false}>Change avatar</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AvatarForm;
