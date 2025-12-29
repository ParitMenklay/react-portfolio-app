import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
function ArticleSection() {
  return (
    <>
      <section className="flex flex-col h-[350px] md:px-32 md:py-20">
        <h3 className="p-4 gap-2.5">Latest articles</h3>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-brown-200 p-4 h-auto md:h-20 gap-4 md:rounded-xl">
          <div className="hidden md:flex ">
            <Tabs defaultValue="Highlight" className="w-[400px] h-full gap-0 ">
              <TabsList className="gap-4">
                <TabsTrigger
                  value="Highlight"
                  className="body-1 text-brown-400"
                >
                  Highlight
                </TabsTrigger>
                <TabsTrigger value="Cat" className="body-1 text-brown-400">
                  Cat
                </TabsTrigger>
                <TabsTrigger
                  value="Inspiration"
                  className="body-1 text-brown-400"
                >
                  Inspiration
                </TabsTrigger>
                <TabsTrigger value="General" className="body-1 text-brown-400">
                  General
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Highlight"></TabsContent>
              <TabsContent value="Cat"></TabsContent>
              <TabsContent value="Inspiration"></TabsContent>
              <TabsContent value="General"></TabsContent>
            </Tabs>
          </div>
          <div>
            <InputGroup
              className="
      bg-white
      h-12
      w-full lg:w-[320px] 
    "
            >
              <InputGroupInput
                placeholder="Search"
                className="body-1 text-brown-400"
              />
              <InputGroupAddon align="inline-end">
                <Search className="w-4 h-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="md:hidden flex flex-col gap-1">
            <Label className="body-1 text-brown-400">Category</Label>
            <Select>
              <SelectTrigger className="w-full h-12! bg-white">
                <SelectValue className="body-1! text-brown-400!" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Highlight">Highlight</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Inspiration">Inspiration</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
}
export default ArticleSection;
