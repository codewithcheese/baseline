<script lang="ts">
  import { goto } from "$app/navigation";
  import Form from "../Form.svelte";
  import { documentTable } from "@/database/schema";
  import { eq } from "drizzle-orm";
  import { toast } from "svelte-french-toast";
  import { useDb } from "@/database/client";

  let { data } = $props();
  let document = $derived(data.document);

  async function submit(e: any) {
    e.preventDefault();
    try {
      await useDb()
        .update(documentTable)
        .set({
          name: document.name,
          description: document.description,
          content: document.content,
        })
        .where(eq(documentTable.id, document.id));
      await goto(`/document`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unknown error");
    }
  }
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  <div class="flex items-center">
    <h1 class="flex-1 text-lg font-semibold md:text-xl">Edit document</h1>
  </div>
  <Form
    bind:name={document.name}
    bind:description={document.description}
    bind:content={document.content}
    onSubmit={submit}
  />
</main>
