import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";

import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/categories")({
	component: CategoriesRoute,
});

function CategoriesRoute() {
	const todos = useQuery(orpc.categories.getAll.queryOptions());

	return (
		<div className="mx-auto w-full max-w-md py-10">
			<Card>
				<CardHeader>
					<CardTitle>Shoes Categories</CardTitle>
				</CardHeader>
				<CardContent>
					{todos.isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : todos.data?.length === 0 ? (
						<p className="py-4 text-center">No categories yet!</p>
					) : (
						<ul className="space-y-2">
							{todos.data?.map((todo) => (
								<li
									key={todo.id}
									className="flex items-center justify-between rounded-md border p-2"
								>
									<div className="flex items-center space-x-2">
										<label
											htmlFor={"todo-${todo.id}"}
										>
											{todo.category_name}
										</label>
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
