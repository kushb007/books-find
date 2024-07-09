import pandas as pd

#df = pd.read_json('books-with-embeddings.json')
df = pd.read_csv('emb_books.csv')

row_limit = 1000
dfs = [df[i:i+row_limit] for i in range(0, len(df), row_limit)]

# Saving each part into separate JSON files
for i, part_df in enumerate(dfs):
    filename = f'part_{i+1}.json'
    part_df.to_json(filename, orient='records')
    print(f'Part {i+1} saved as {filename}')